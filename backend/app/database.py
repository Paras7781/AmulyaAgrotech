from datetime import datetime, timezone
from sqlalchemy import create_engine, String, Float, Boolean, DateTime, JSON, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker
from .core.config import settings


def normalize_database_url(database_url: str) -> str:
    if database_url.startswith("postgres://"):
        return "postgresql+psycopg://" + database_url.removeprefix("postgres://")
    if database_url.startswith("postgresql://"):
        return "postgresql+psycopg://" + database_url.removeprefix("postgresql://")
    return database_url


def utc_now():
    return datetime.now(timezone.utc)

database_url = normalize_database_url(settings.database_url)
engine = create_engine(
    database_url,
    connect_args={"check_same_thread": False} if database_url.startswith("sqlite") else {},
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False)

class Base(DeclarativeBase):
    pass

class Drone(Base):
    __tablename__ = 'drones'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True)
    description: Mapped[str] = mapped_column(Text)
    price: Mapped[float] = mapped_column(Float, default=0.0)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class Enquiry(Base):
    __tablename__ = 'enquiries'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    mobile: Mapped[str] = mapped_column(String(20), index=True)
    email: Mapped[str | None] = mapped_column(String(180), nullable=True)
    location: Mapped[str | None] = mapped_column(String(180), nullable=True)
    subject: Mapped[str] = mapped_column(String(180), default="General Enquiry")
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    language: Mapped[str | None] = mapped_column(String(10), nullable=True, default="en")
    status: Mapped[str] = mapped_column(String(30), default='NEW')  # NEW, CONTACTED, RESOLVED, CLOSED
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class Quotation(Base):
    __tablename__ = 'quotations'
    id: Mapped[int] = mapped_column(primary_key=True)
    reference_number: Mapped[str | None] = mapped_column(String(40), index=True, nullable=True)
    quotation_number: Mapped[str | None] = mapped_column(String(40), nullable=True)
    drone_id: Mapped[int | None] = mapped_column(nullable=True)
    customer_name: Mapped[str] = mapped_column(String(120))
    mobile: Mapped[str] = mapped_column(String(20))
    email: Mapped[str | None] = mapped_column(String(180), nullable=True)
    location: Mapped[str | None] = mapped_column(String(180), nullable=True)
    need: Mapped[str | None] = mapped_column(String(120), nullable=True)
    drone_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    land_area: Mapped[str | None] = mapped_column(String(120), nullable=True)
    crop: Mapped[str | None] = mapped_column(String(120), nullable=True)
    timeline: Mapped[str | None] = mapped_column(String(120), nullable=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(80), default='General')
    base_price: Mapped[float] = mapped_column(Float, default=0.0)
    subsidy: Mapped[float] = mapped_column(Float, default=0.0)
    tax: Mapped[float] = mapped_column(Float, default=0.0)
    final_amount: Mapped[float] = mapped_column(Float, default=0.0)
    language: Mapped[str | None] = mapped_column(String(10), nullable=True, default="en")
    status: Mapped[str] = mapped_column(String(30), default='NEW')  # NEW, REVIEWING, CONTACTED, QUOTED, COMPLETED, CANCELLED
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class PublicQuotationRequest(Base):
    __tablename__ = "public_quotation_requests"
    reference_number: Mapped[str] = mapped_column(String(40), primary_key=True)
    payload: Mapped[dict[str, str | None]] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
