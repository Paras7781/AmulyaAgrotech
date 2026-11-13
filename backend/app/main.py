import logging
import re
import secrets
from datetime import datetime, timedelta, timezone
from io import BytesIO
from typing import Dict, List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from .core.config import settings
from .core.notifications import (
    is_email_configured,
    is_mock_mode_enabled,
    send_contact_emails,
    send_quotation_emails,
)
from .core.rate_limit import SlidingWindowLimiter
from .database import Base, Drone, PublicQuotationRequest, Quotation, SessionLocal, engine
from .schemas import (
    ContactCreate,
    ContactResponse,
    DroneResponse,
    QuotationCreate,
    QuotationResponse,
)

logger = logging.getLogger("amulya.api")

# Initialize read-only Database tables (preserves existing drone fleet)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Amulya Agrotech API",
    description="Backend REST API for AMULYA AGROTECH drone technology platform",
    version="1.1.0",
)

# Setup CORS Middleware with strict origin control
allowed_origins_list = [
    origin.strip() for origin in settings.allowed_origins.split(",") if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins_list if allowed_origins_list else [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    if settings.environment.strip().lower() in {"prod", "production"}:
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000")
    return response


def get_db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


submission_limiter = SlidingWindowLimiter(
    limit=settings.public_enquiry_rate_limit,
    window_seconds=settings.public_enquiry_rate_window_seconds,
)


def enforce_public_submission_limit(request: Request) -> None:
    client_ip = request.client.host if request.client else "unknown"
    retry_after = submission_limiter.check(client_ip)
    if retry_after is not None:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please try again later.",
            headers={"Retry-After": str(retry_after)},
        )


# Global safe exception handler: Prevent internal error details from leaking to users
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )
    logger.error("Unhandled server exception on %s %s: %s", request.method, request.url.path, exc, exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again later."},
    )

# -----------------------------------------------------------------------------
# Bounded in-memory caches for PDF responses and duplicate debouncing.
# Contact submissions remain email-only; successful quotations are persisted for PDF recovery.
# -----------------------------------------------------------------------------
recent_contacts: Dict[str, dict] = {}
quotation_cache: Dict[str, dict] = {}
recent_quotes_by_user: Dict[str, dict] = {}

# -----------------------------------------------------------------------------
# Health Check
# -----------------------------------------------------------------------------
@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "amulya-agrotech-api",
        "company": settings.company_name,
        "email_delivery": "mock" if is_mock_mode_enabled() else ("configured" if is_email_configured() else "unconfigured"),
    }

# -----------------------------------------------------------------------------
# Public Contact / Enquiry API (Email-Only, No DB Storage)
# -----------------------------------------------------------------------------
@app.post(
    "/api/contact",
    response_model=ContactResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(enforce_public_submission_limit)],
)
@app.post(
    "/api/enquiries",
    response_model=ContactResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(enforce_public_submission_limit)],
)
def submit_contact(payload: ContactCreate):
    try:
        mobile = payload.get_mobile()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    now_utc = datetime.now(timezone.utc)
    user_key = f"{mobile}:{payload.name.strip().lower()}"

    # Prevent accidental rapid duplicate submissions (15 seconds debounce)
    for key, entry in list(recent_contacts.items()):
        if now_utc - entry["time"] >= timedelta(seconds=15):
            del recent_contacts[key]
    while len(recent_contacts) >= 10_000:
        del recent_contacts[next(iter(recent_contacts))]

    if user_key in recent_contacts:
        prev = recent_contacts[user_key]
        if now_utc - prev["time"] < timedelta(seconds=15):
            return ContactResponse(
                success=True,
                message=prev["message"],
                id=1,
                reference_number=prev["ref_no"],
                status=prev["status"],
            )

    ref_no = f"AMC-{now_utc.year}-{secrets.token_hex(16).upper()}"

    payload_dict = {
        "name": payload.name,
        "phone": mobile,
        "email": payload.email,
        "location": payload.location,
        "service": payload.get_subject(),
        "message": payload.message,
        "language": payload.language or "en",
    }

    # Dispatch email notifications (Business notification + Customer confirmation)
    success, detail_msg = send_contact_emails(payload_dict, ref_no)
    if not success:
        # Does NOT fake success when unconfigured or delivery fails
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail_msg,
        )

    delivery_status = "PARTIAL" if "confirmation email could not be delivered" in detail_msg else "SENT"
    recent_contacts[user_key] = {
        "time": now_utc,
        "ref_no": ref_no,
        "message": detail_msg,
        "status": delivery_status,
    }

    return ContactResponse(
        success=True,
        message=detail_msg,
        id=1,
        reference_number=ref_no,
        status=delivery_status,
    )

# -----------------------------------------------------------------------------
# Public Quotation Request API (email notifications with persistent PDF data)
# -----------------------------------------------------------------------------
@app.post(
    "/api/quotations",
    response_model=QuotationResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(enforce_public_submission_limit)],
)
def create_quotation_request(payload: QuotationCreate, session: Session = Depends(get_db)):
    try:
        customer_name = payload.get_name()
        mobile = payload.get_mobile()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    now_utc = datetime.now(timezone.utc)
    user_key = f"{mobile}:{customer_name.strip().lower()}"

    # Check recent duplicate submission in last 15 seconds
    for key, entry in list(recent_quotes_by_user.items()):
        if now_utc - entry["time"] >= timedelta(seconds=15):
            del recent_quotes_by_user[key]
    while len(recent_quotes_by_user) >= 10_000:
        del recent_quotes_by_user[next(iter(recent_quotes_by_user))]

    if user_key in recent_quotes_by_user:
        prev = recent_quotes_by_user[user_key]
        if now_utc - prev["time"] < timedelta(seconds=15):
            return QuotationResponse(
                success=True,
                message="Quotation request already submitted. Please check your email.",
                reference_number=prev["ref_no"],
                id=1,
                status="SENT",
            )

    drone_name = payload.drone or "Standard Fleet"
    if payload.drone_id:
        drone_obj = session.get(Drone, payload.drone_id)
        if drone_obj:
            drone_name = drone_obj.name

    ref_no = f"AMQ-{now_utc.year}-{secrets.token_hex(16).upper()}"

    quote_dict = {
        "reference_number": ref_no,
        "customer_name": customer_name,
        "mobile": mobile,
        "email": payload.email,
        "location": payload.location or "Not specified",
        "need": payload.need or "Agricultural Drone",
        "drone_name": drone_name,
        "land_area": payload.get_land_area() or "Not specified",
        "crop": payload.crop or "General Agricultural",
        "timeline": payload.timeline or "Immediate",
        "message": payload.get_message() or "None",
        "language": payload.language or "en",
        "status": "SENT",
        "created_at": now_utc.strftime("%Y-%m-%d %H:%M:%S UTC"),
    }

    # Dispatch email notifications (Business notification + Customer confirmation)
    success, detail_msg = send_quotation_emails(quote_dict, ref_no)
    if not success:
        # Does NOT produce fake success when unconfigured
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail_msg,
        )

    try:
        session.add(PublicQuotationRequest(reference_number=ref_no, payload=quote_dict))
        session.commit()
    except SQLAlchemyError as exc:
        session.rollback()
        logger.error(
            "Could not persist quotation request %s (%s)",
            ref_no,
            type(exc).__name__,
        )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The quotation could not be saved for PDF download. Please contact us before resubmitting.",
        )

    # Keep a bounded cache for fast PDF downloads; the database is the durable source.
    if len(quotation_cache) >= 1_000:
        del quotation_cache[next(iter(quotation_cache))]
    quotation_cache[ref_no] = quote_dict
    recent_quotes_by_user[user_key] = {"time": now_utc, "ref_no": ref_no}

    return QuotationResponse(
        success=True,
        message=detail_msg,
        reference_number=ref_no,
        id=1,
        status="SENT",
    )

# -----------------------------------------------------------------------------
# Customer download receipt/PDF by verified reference number
# -----------------------------------------------------------------------------
@app.get("/api/quotations/{reference_number}/pdf")
def generate_quotation_pdf(reference_number: str, session: Session = Depends(get_db)):
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,80}", reference_number):
        raise HTTPException(status_code=404, detail="Quotation reference not found")

    # 1. First check in-memory cache
    quote = quotation_cache.get(reference_number)

    # 2. Load newly submitted quotations from durable storage
    if not quote:
        persisted_quote = session.get(PublicQuotationRequest, reference_number)
        if persisted_quote:
            quote = persisted_quote.payload

    # 3. Fallback to historical quotation records
    if not quote:
        db_quote = session.query(Quotation).filter(
            (Quotation.reference_number == reference_number) | (Quotation.quotation_number == reference_number)
        ).first()
        if db_quote:
            quote = {
                "reference_number": db_quote.reference_number or f"AMQ-{db_quote.id}",
                "customer_name": db_quote.customer_name,
                "mobile": db_quote.mobile,
                "email": db_quote.email,
                "location": db_quote.location,
                "need": db_quote.need or db_quote.category,
                "drone_name": db_quote.drone_name,
                "land_area": db_quote.land_area,
                "crop": db_quote.crop,
                "timeline": db_quote.timeline,
                "status": db_quote.status,
            }

    if not quote:
        raise HTTPException(status_code=404, detail="Quotation reference not found")

    output = BytesIO()
    pdf = canvas.Canvas(output, pagesize=A4)
    width, height = A4

    # Header accent band
    pdf.setFillColorRGB(0.95, 0.76, 0.12)
    pdf.rect(0, height - 90, width, 90, fill=1, stroke=0)

    pdf.setFillColorRGB(0.08, 0.08, 0.06)
    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(42, height - 52, settings.company_name)

    pdf.setFont("Helvetica-Bold", 22)
    pdf.drawString(42, height - 140, "QUOTATION ESTIMATE REQUEST")

    ref_str = quote.get("reference_number", reference_number)
    pdf.setFont("Helvetica", 10)
    pdf.drawString(42, height - 160, f"Ref: {ref_str}")

    rows = [
        ("Customer Name", quote.get("customer_name", "N/A")),
        ("Mobile Phone", quote.get("mobile", "N/A")),
        ("Email Address", quote.get("email") or "N/A"),
        ("Location", quote.get("location") or "N/A"),
        ("Requirement", quote.get("need") or "N/A"),
        ("Selected Drone", quote.get("drone_name") or "N/A"),
        ("Land Area", quote.get("land_area") or "N/A"),
        ("Crop", quote.get("crop") or "N/A"),
        ("Timeline", quote.get("timeline") or "N/A"),
        ("Status", quote.get("status", "SENT")),
    ]

    y = height - 210
    for label, value in rows:
        pdf.setFillColorRGB(0.35, 0.37, 0.33)
        pdf.setFont("Helvetica", 10)
        pdf.drawString(42, y, label)

        pdf.setFillColorRGB(0.08, 0.08, 0.06)
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawRightString(width - 42, y, str(value))
        y -= 26

    pdf.setFillColorRGB(0.35, 0.37, 0.33)
    pdf.setFont("Helvetica", 9)
    pdf.drawString(42, 60, "AMULYA AGROTECH (P) LTD • 308, 1st Floor, Nagaon Fata, Nagaon, Kolhapur - 416122")
    pdf.save()

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="application/pdf",
        headers={
            "Cache-Control": "private, no-store",
            "Content-Disposition": f"attachment; filename={reference_number}.pdf",
        },
    )

# -----------------------------------------------------------------------------
# Read-Only Public Drones API
# -----------------------------------------------------------------------------
@app.get("/api/drones", response_model=List[DroneResponse])
def list_drones(session: Session = Depends(get_db)):
    return session.query(Drone).filter(Drone.active.is_(True)).order_by(Drone.created_at.desc()).all()
