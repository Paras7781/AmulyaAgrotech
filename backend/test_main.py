import json
import urllib.error
import urllib.request

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError
from app.main import app, quotation_cache, recent_contacts, recent_quotes_by_user, submission_limiter
from app.core.config import Settings, settings
from app.core.notifications import (
    can_send_email,
    clear_mock_outbox,
    dispatch_email,
    is_mock_mode_enabled,
    mock_outbox,
)
from app.database import (
    Enquiry,
    PublicQuotationRequest,
    Quotation,
    SessionLocal,
    normalize_database_url,
)

client = TestClient(app)

@pytest.fixture(autouse=True)
def reset_mock_state():
    clear_mock_outbox()
    orig_mock_mode = settings.smtp_mock_mode
    orig_host = settings.smtp_host
    orig_notify = settings.notification_email
    orig_environment = settings.environment
    orig_email_provider = settings.email_provider
    orig_resend_api_key = settings.resend_api_key
    orig_email_from = settings.email_from
    submission_limiter.clear()
    quotation_cache.clear()
    recent_contacts.clear()
    recent_quotes_by_user.clear()
    yield
    settings.smtp_mock_mode = orig_mock_mode
    settings.smtp_host = orig_host
    settings.notification_email = orig_notify
    settings.environment = orig_environment
    settings.email_provider = orig_email_provider
    settings.resend_api_key = orig_resend_api_key
    settings.email_from = orig_email_from
    clear_mock_outbox()
    submission_limiter.clear()
    quotation_cache.clear()
    recent_contacts.clear()
    recent_quotes_by_user.clear()

@pytest.fixture
def persisted_quote_cleanup():
    references = []
    yield references
    if references:
        session = SessionLocal()
        try:
            for reference in set(references):
                record = session.get(PublicQuotationRequest, reference)
                if record:
                    session.delete(record)
            session.commit()
        finally:
            session.close()

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "amulya-agrotech-api"
    assert "company" in data
    assert "email_delivery" in data
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"


def test_postgres_database_urls_use_installed_psycopg_driver():
    assert normalize_database_url(
        "postgres://user:password@host/database?sslmode=require"
    ) == "postgresql+psycopg://user:password@host/database?sslmode=require"
    assert normalize_database_url(
        "postgresql://user:password@host/database?sslmode=require"
    ) == "postgresql+psycopg://user:password@host/database?sslmode=require"
    assert normalize_database_url(
        "postgresql+psycopg://user:password@host/database"
    ) == "postgresql+psycopg://user:password@host/database"
    assert normalize_database_url("sqlite:///./amulya.db") == "sqlite:///./amulya.db"


def test_resend_delivery_uses_mocked_https_request(monkeypatch):
    settings.email_provider = "resend"
    settings.resend_api_key = "test-api-key"
    settings.email_from = "Amulya Agrotech <alerts@example.com>"
    settings.notification_email = "business@example.com"
    settings.smtp_mock_mode = False
    captured = {}

    class MockResponse:
        status = 200

        def __enter__(self):
            return self

        def __exit__(self, *_args):
            return False

    def fake_urlopen(request, timeout):
        captured["url"] = request.full_url
        captured["authorization"] = request.get_header("Authorization")
        captured["user_agent"] = request.get_header("User-agent")
        captured["timeout"] = timeout
        captured["payload"] = json.loads(request.data)
        return MockResponse()

    monkeypatch.setattr(urllib.request, "urlopen", fake_urlopen)
    assert can_send_email()
    success, message = dispatch_email(
        "customer@example.com", "Enquiry received", "Thank you for contacting us."
    )

    assert success is True
    assert message == "Email sent successfully"
    assert captured == {
        "url": "https://api.resend.com/emails",
        "authorization": "Bearer test-api-key",
        "user_agent": "amulya-agrotech-api/1.0",
        "timeout": 12,
        "payload": {
            "from": "Amulya Agrotech <alerts@example.com>",
            "to": ["customer@example.com"],
            "subject": "Enquiry received",
            "text": "Thank you for contacting us.",
        },
    }


def test_resend_delivery_failure_does_not_expose_provider_response(monkeypatch):
    settings.email_provider = "resend"
    settings.resend_api_key = "test-api-key"
    settings.email_from = "alerts@example.com"
    settings.notification_email = "business@example.com"
    settings.smtp_mock_mode = False

    def fail_urlopen(request, timeout):
        raise urllib.error.HTTPError(
            request.full_url,
            503,
            "Unavailable",
            {},
            None,
        )

    monkeypatch.setattr(urllib.request, "urlopen", fail_urlopen)
    success, message = dispatch_email(
        "customer@example.com", "Enquiry received", "Thank you."
    )

    assert success is False
    assert message == "Email delivery failed. Please try again later."


def test_unconfigured_smtp_does_not_produce_fake_success():
    """Verify that unconfigured SMTP returns HTTP 503 instead of fake success."""
    settings.smtp_mock_mode = False
    settings.smtp_host = ""
    settings.notification_email = ""
    session = SessionLocal()
    initial_quote_request_count = session.query(PublicQuotationRequest).count()
    session.close()

    # Contact submission must fail honestly
    res_contact = client.post("/api/contact", json={
        "name": "Rohan Deshmukh",
        "phone": "9876543210",
        "email": "rohan@example.com",
        "message": "Testing unconfigured SMTP."
    })
    assert res_contact.status_code == 503
    assert "not configured" in res_contact.json()["detail"].lower()

    # Quotation submission must fail honestly
    res_quote = client.post("/api/quotations", json={
        "name": "Rohan Deshmukh",
        "phone": "9876543210",
        "email": "rohan@example.com",
        "landArea": "10 acres"
    })
    assert res_quote.status_code == 503
    assert "not configured" in res_quote.json()["detail"].lower()
    session = SessionLocal()
    assert session.query(PublicQuotationRequest).count() == initial_quote_request_count
    session.close()

def test_contact_submission_mocked_email():
    """Verify email delivery to business & customer with zero database storage."""
    settings.smtp_mock_mode = True
    settings.notification_email = "business@amulyaagrotech.com"

    session = SessionLocal()
    initial_enquiry_count = session.query(Enquiry).count()
    session.close()

    payload = {
        "name": "Rajesh Patil",
        "phone": "+91 9876543210",
        "email": "rajesh.patil@example.com",
        "location": "Kolhapur",
        "service": "Precision Spraying",
        "message": "Interested in drone spraying for sugarcane crop.",
        "language": "mr"
    }

    response = client.post("/api/contact", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["status"] == "SENT"
    assert "reference_number" in data
    ref_no = data["reference_number"]
    assert ref_no.startswith("AMC-")
    assert len(ref_no.rsplit("-", 1)[1]) == 32

    # Verify emails were recorded in mock outbox
    assert len(mock_outbox) == 2
    # 1. Business notification
    biz_email = next((e for e in mock_outbox if e["to"] == "business@amulyaagrotech.com"), None)
    assert biz_email is not None
    assert ref_no in biz_email["subject"]
    assert "Rajesh Patil" in biz_email["body"]

    # 2. Customer confirmation
    cust_email = next((e for e in mock_outbox if e["to"] == "rajesh.patil@example.com"), None)
    assert cust_email is not None
    assert ref_no in cust_email["subject"]
    assert ref_no in cust_email["body"]

    # Verify ABSOLUTELY NO database storage
    session2 = SessionLocal()
    current_enquiry_count = session2.query(Enquiry).count()
    session2.close()
    assert current_enquiry_count == initial_enquiry_count


def test_contact_without_customer_email_reports_business_delivery_only():
    settings.smtp_mock_mode = True
    settings.notification_email = "business@amulyaagrotech.com"
    response = client.post("/api/contact", json={
        "name": "Business Only",
        "phone": "9876543210",
    })

    assert response.status_code == 201
    assert "business notification was delivered" in response.json()["message"]
    assert len(mock_outbox) == 1


def test_contact_submission_invalid():
    settings.smtp_mock_mode = True
    # Test invalid short name
    response = client.post("/api/contact", json={"name": "A", "phone": "9876543210"})
    assert response.status_code == 422

    # Test invalid mobile number
    response2 = client.post("/api/contact", json={"name": "Test User", "phone": "123"})
    assert response2.status_code == 400

def test_quotation_submission_mocked_email(persisted_quote_cleanup):
    """Verify quotation emails while preserving legacy quotation-table contents."""
    settings.smtp_mock_mode = True
    settings.notification_email = "business@amulyaagrotech.com"

    session = SessionLocal()
    initial_quote_count = session.query(Quotation).count()
    session.close()

    payload = {
        "need": "Drone Purchase",
        "drone": "SPRAYING SERIES",
        "landArea": "15 acres",
        "crop": "Sugarcane",
        "timeline": "Next month",
        "name": "Suresh Deshmukh",
        "phone": "9123456789",
        "email": "suresh.deshmukh@example.com",
        "location": "Hatkanangale",
        "message": "Required for 15 acre field.",
        "language": "en"
    }

    response = client.post("/api/quotations", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    ref_no = data["reference_number"]
    persisted_quote_cleanup.append(ref_no)
    assert ref_no.startswith("AMQ-")

    # Verify matching reference numbers in emails
    assert len(mock_outbox) == 2
    biz_email = next((e for e in mock_outbox if e["to"] == "business@amulyaagrotech.com"), None)
    assert biz_email is not None
    assert ref_no in biz_email["subject"]

    cust_email = next((e for e in mock_outbox if e["to"] == "suresh.deshmukh@example.com"), None)
    assert cust_email is not None
    assert ref_no in cust_email["subject"]
    assert ref_no in cust_email["body"]

    # Verify ABSOLUTELY NO database storage
    session2 = SessionLocal()
    current_quote_count = session2.query(Quotation).count()
    session2.close()
    assert current_quote_count == initial_quote_count

def test_quotation_duplicate_prevention(persisted_quote_cleanup):
    settings.smtp_mock_mode = True
    settings.notification_email = "business@amulyaagrotech.com"

    payload = {
        "need": "Spraying",
        "drone": "MAPPING SERIES",
        "landArea": "5 acres",
        "crop": "Soybean",
        "timeline": "Immediate",
        "name": "Vikram Shinde",
        "phone": "9988776655",
        "email": "vikram@example.com",
        "location": "Sangli",
        "message": "Testing duplicate prevention.",
        "language": "hi"
    }
    res1 = client.post("/api/quotations", json=payload)
    assert res1.status_code == 201
    ref1 = res1.json()["reference_number"]
    persisted_quote_cleanup.append(ref1)

    res2 = client.post("/api/quotations", json=payload)
    assert res2.status_code == 201
    ref2 = res2.json()["reference_number"]

    assert ref1 == ref2

def test_privacy_no_public_data_leaks():
    res_contact = client.get("/api/contact")
    assert res_contact.status_code in [404, 405]

    res_quotes = client.get("/api/quotations")
    assert res_quotes.status_code in [404, 405]

    res_admin = client.post("/api/admin/drones", json={"name": "Admin Drone"})
    assert res_admin.status_code in [404, 405]


def test_enquiry_alias_and_public_drone_catalog():
    settings.smtp_mock_mode = True
    settings.notification_email = "business@amulyaagrotech.com"
    response = client.post("/api/enquiries", json={
        "name": "Alias Request",
        "phone": "9876543210",
    })
    assert response.status_code == 201
    assert response.json()["reference_number"].startswith("AMC-")

    drones_response = client.get("/api/drones")
    assert drones_response.status_code == 200
    assert isinstance(drones_response.json(), list)
    for drone in drones_response.json():
        assert {"id", "name", "slug", "description", "price", "active"} <= drone.keys()


def test_quotation_pdf_download_by_reference(persisted_quote_cleanup):
    settings.smtp_mock_mode = True
    settings.notification_email = "business@amulyaagrotech.com"

    payload = {
        "name": "Anil Kadam",
        "phone": "9822001122",
        "email": "anil@example.com",
        "crop": "Cotton",
        "landArea": "20 acres",
        "need": "Spraying Services",
        "language": "mr"
    }
    res = client.post("/api/quotations", json=payload)
    assert res.status_code == 201
    ref_no = res.json()["reference_number"]
    persisted_quote_cleanup.append(ref_no)

    session = SessionLocal()
    persisted = session.get(PublicQuotationRequest, ref_no)
    assert persisted is not None
    assert persisted.payload["customer_name"] == "Anil Kadam"
    session.close()

    quotation_cache.clear()
    pdf_res = client.get(f"/api/quotations/{ref_no}/pdf")
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert pdf_res.headers["cache-control"] == "private, no-store"
    assert len(pdf_res.content) > 100


def test_submission_validation_rejects_malformed_and_oversized_fields():
    response = client.post("/api/contact", json={
        "name": "Valid Name",
        "phone": "9876543210",
        "email": "invalid-address",
    })
    assert response.status_code == 422

    response = client.post("/api/contact", json={
        "name": "Valid\nBcc: attacker@example.com",
        "phone": "9876543210",
    })
    assert response.status_code == 422

    response = client.post("/api/quotations", json={
        "name": "Valid Name",
        "phone": "9876543210",
        "message": "x" * 2001,
    })
    assert response.status_code == 422


def test_public_enquiry_rate_limit_returns_retry_after():
    settings.smtp_mock_mode = True
    settings.notification_email = "business@amulyaagrotech.com"
    payload = {"name": "Rate Limited User", "phone": "9876543210"}

    for _ in range(settings.public_enquiry_rate_limit):
        response = client.post("/api/contact", json=payload)
        assert response.status_code == 201

    response = client.post("/api/contact", json=payload)
    assert response.status_code == 429
    assert int(response.headers["retry-after"]) > 0


def test_mock_email_mode_is_never_effective_in_production():
    settings.environment = "production"
    settings.smtp_mock_mode = True
    settings.smtp_host = ""
    settings.notification_email = ""

    assert is_mock_mode_enabled() is False
    assert can_send_email() is False
    assert client.get("/api/health").json()["email_delivery"] == "unconfigured"


def test_production_settings_reject_mock_email_mode():
    with pytest.raises(ValidationError, match="SMTP_MOCK_MODE"):
        Settings(
            environment="production",
            smtp_mock_mode=True,
            allowed_origins="https://amulyaagrotech.com",
        )


def test_production_settings_reject_insecure_cors_origins():
    for origins in ("*", "http://amulyaagrotech.com"):
        with pytest.raises(ValidationError, match="HTTPS origins"):
            Settings(
                environment="production",
                smtp_mock_mode=False,
                allowed_origins=origins,
            )


def test_customer_confirmation_failure_does_not_report_delivery_success(monkeypatch):
    settings.notification_email = "business@amulyaagrotech.com"
    settings.smtp_host = "smtp.example.com"
    settings.smtp_mock_mode = False

    def deliver(to_email, subject, body):
        if to_email == "customer@example.com":
            return False, "internal SMTP detail"
        return True, "sent"

    monkeypatch.setattr("app.core.notifications.dispatch_email", deliver)
    response = client.post("/api/contact", json={
        "name": "Customer Name",
        "phone": "9876543210",
        "email": "customer@example.com",
    })

    assert response.status_code == 201
    assert "confirmation email could not be delivered" in response.json()["message"]
    assert response.json()["status"] == "PARTIAL"
    assert "internal SMTP detail" not in response.json()["message"]

    duplicate = client.post("/api/contact", json={
        "name": "Customer Name",
        "phone": "9876543210",
        "email": "customer@example.com",
    })
    assert duplicate.status_code == 201
    assert duplicate.json()["status"] == "PARTIAL"
    assert "confirmation email could not be delivered" in duplicate.json()["message"]
