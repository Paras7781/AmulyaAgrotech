import logging
import json
import smtplib
import urllib.error
import urllib.request
from email.message import EmailMessage
from typing import Dict, List, Optional, Tuple
from .config import settings

logger = logging.getLogger("amulya.notifications")

# In-memory outbox for automated test inspection and mock delivery verification
mock_outbox: List[Dict[str, str]] = []

def is_smtp_configured() -> bool:
    """Check if real SMTP credentials are fully provided."""
    return bool(settings.smtp_host and settings.notification_email)


def is_resend_configured() -> bool:
    return bool(
        settings.resend_api_key
        and (settings.email_from or settings.smtp_from)
        and settings.notification_email
    )


def is_email_configured() -> bool:
    if settings.email_provider == "resend":
        return is_resend_configured()
    return is_smtp_configured()


def is_mock_mode_enabled() -> bool:
    return (
        settings.smtp_mock_mode
        and settings.environment.strip().lower() not in {"prod", "production"}
    )


def can_send_email() -> bool:
    """Returns True if the selected real provider is configured or mock mode is enabled."""
    return is_email_configured() or is_mock_mode_enabled()

def clear_mock_outbox():
    mock_outbox.clear()


def _dispatch_resend_email(to_email: str, subject: str, body: str) -> Tuple[bool, str]:
    if not is_resend_configured():
        return False, "HTTPS email API is not configured."

    payload = json.dumps({
        "from": settings.email_from or settings.smtp_from,
        "to": [to_email],
        "subject": subject,
        "text": body,
    }).encode("utf-8")
    request = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        headers={
            "Authorization": f"Bearer {settings.resend_api_key}",
            "Content-Type": "application/json",
            "User-Agent": "amulya-agrotech-api/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=12) as response:
            if 200 <= response.status < 300:
                logger.info("HTTPS email API delivered successfully")
                return True, "Email sent successfully"
            logger.error("HTTPS email API returned status %s", response.status)
    except urllib.error.HTTPError as exc:
        logger.error("HTTPS email API rejected message (HTTP %s)", exc.code)
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        logger.error("HTTPS email API request failed (%s)", type(exc).__name__)

    return False, "Email delivery failed. Please try again later."


def dispatch_email(to_email: str, subject: str, body: str) -> Tuple[bool, str]:
    """
    Core dispatcher that sends an actual email or records to mock_outbox in test mode.
    Does NOT produce fake success when unconfigured.
    """
    if is_mock_mode_enabled():
        mock_outbox.append({
            "to": to_email,
            "subject": subject,
            "body": body,
            "from": settings.smtp_from or "notifications@amulyaagrotech.com",
        })
        logger.info("Mock email delivered")
        return True, "Mock email delivered successfully"

    if settings.email_provider == "resend":
        return _dispatch_resend_email(to_email, subject, body)

    if not is_smtp_configured():
        msg = "SMTP service is not configured on the server."
        logger.warning(msg)
        return False, msg

    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = settings.smtp_from or settings.smtp_user or "notifications@amulyaagrotech.com"
        msg["To"] = to_email
        msg.set_content(body)

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=12) as server:
            server.starttls()
            if settings.smtp_user and settings.smtp_password:
                server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)

        logger.info("Real SMTP email delivered successfully")
        return True, "Email sent successfully"
    except (OSError, smtplib.SMTPException) as exc:
        logger.error("SMTP transmission failed (%s)", type(exc).__name__)
        return False, "Email delivery failed. Please try again later."

def send_contact_emails(payload_dict: dict, ref_no: str) -> Tuple[bool, str]:
    """
    Dispatches:
    1) Business notification to settings.notification_email.
    2) Customer confirmation to customer's email (if provided).
    Returns (True, message) if delivered, or (False, error) if failed/unconfigured.
    """
    if not can_send_email():
        return False, "Email notification service is not configured. Please contact +91 7972908815."

    name = payload_dict.get("name", "Customer")
    phone = payload_dict.get("phone", "")
    customer_email = payload_dict.get("email")
    location = payload_dict.get("location", "Not specified")
    service = payload_dict.get("service", "General Enquiry")
    message = payload_dict.get("message", "No message provided")
    language = payload_dict.get("language", "en")

    # 1. Business Notification
    biz_subject = f"New Enquiry [{ref_no}] from {name} - {service}"
    biz_body = (
        f"NEW CONTACT ENQUIRY - {settings.company_name}\n"
        f"==================================================\n"
        f"Reference Number: {ref_no}\n"
        f"Customer Name:   {name}\n"
        f"Contact Phone:   {phone}\n"
        f"Customer Email:  {customer_email or 'N/A'}\n"
        f"Location:        {location}\n"
        f"Requirement:     {service}\n"
        f"Language:        {language}\n\n"
        f"Message:\n{message}\n"
        f"==================================================\n"
        f"Amulya Agrotech Automated Notification System\n"
    )
    biz_target = settings.notification_email or "admin@amulyaagrotech.com"
    success_biz, err_biz = dispatch_email(biz_target, biz_subject, biz_body)
    if not success_biz:
        return False, f"Could not notify business: {err_biz}"

    # 2. Customer Confirmation (if email is provided)
    if customer_email and "@" in customer_email:
        cust_subject = f"Enquiry Received [{ref_no}] - Amulya Agrotech"
        cust_body = (
            f"Dear {name},\n\n"
            f"Thank you for contacting Amulya Agrotech.\n"
            f"We have received your enquiry regarding '{service}'.\n\n"
            f"Your Enquiry Reference: {ref_no}\n"
            f"Submitted Mobile: {phone}\n"
            f"Service: {service}\n\n"
            f"Our agricultural drone specialists will review your requirements and reach out promptly.\n\n"
            f"For immediate assistance, please call us:\n"
            f"+91 7972908815 / +91 8317711711\n"
            f"Address: 308, 1st Floor, Nagaon Fata, Nagaon, Kolhapur - 416122\n\n"
            f"Warm regards,\n"
            f"Amulya Agrotech Team\n"
        )
        success_customer, error_customer = dispatch_email(customer_email, cust_subject, cust_body)
        if not success_customer:
            logger.warning("Customer confirmation delivery failed: %s", error_customer)
            return True, "Enquiry received, but its confirmation email could not be delivered."
    else:
        return True, "Enquiry received; the business notification was delivered."

    return True, "Enquiry received and email notifications delivered successfully"

def send_quotation_emails(quote_dict: dict, ref_no: str) -> Tuple[bool, str]:
    """
    Dispatches:
    1) Business notification to settings.notification_email.
    2) Customer confirmation to customer's email (if provided) with matching ref_no.
    """
    if not can_send_email():
        return False, "Email notification service is not configured. Please contact +91 7972908815."

    name = quote_dict.get("customer_name") or quote_dict.get("name") or "Customer"
    phone = quote_dict.get("mobile") or quote_dict.get("phone") or ""
    customer_email = quote_dict.get("email")
    location = quote_dict.get("location", "N/A")
    need = quote_dict.get("need", "Agricultural Drone")
    drone = quote_dict.get("drone_name") or quote_dict.get("drone") or "Standard Fleet"
    land_area = quote_dict.get("land_area") or quote_dict.get("landArea") or "N/A"
    crop = quote_dict.get("crop", "N/A")
    timeline = quote_dict.get("timeline", "N/A")
    message = quote_dict.get("message", "N/A")

    # 1. Business Notification
    biz_subject = f"New Quotation Request [{ref_no}] - {name} ({drone})"
    biz_body = (
        f"NEW QUOTATION REQUEST - {settings.company_name}\n"
        f"==================================================\n"
        f"Quotation Reference: {ref_no}\n"
        f"Customer Name:       {name}\n"
        f"Contact Mobile:      {phone}\n"
        f"Customer Email:      {customer_email or 'N/A'}\n"
        f"Location:            {location}\n"
        f"Requirement:         {need}\n"
        f"Selected Drone:      {drone}\n"
        f"Land Area:           {land_area}\n"
        f"Crop:                {crop}\n"
        f"Timeline:            {timeline}\n\n"
        f"Notes/Message:\n{message}\n"
        f"==================================================\n"
    )
    biz_target = settings.notification_email or "admin@amulyaagrotech.com"
    success_biz, err_biz = dispatch_email(biz_target, biz_subject, biz_body)
    if not success_biz:
        return False, f"Could not notify business: {err_biz}"

    # 2. Customer Confirmation
    if customer_email and "@" in customer_email:
        cust_subject = f"Quotation Request Confirmation [{ref_no}] - Amulya Agrotech"
        cust_body = (
            f"Dear {name},\n\n"
            f"Thank you for requesting a quotation from Amulya Agrotech.\n"
            f"Your request has been received with reference number: {ref_no}\n\n"
            f"SUMMARY OF REQUEST:\n"
            f"--------------------------------------------------\n"
            f"Reference ID:    {ref_no}\n"
            f"Selected Drone:  {drone}\n"
            f"Land Area:       {land_area}\n"
            f"Crop:            {crop}\n"
            f"Requirement:     {need}\n"
            f"Timeline:        {timeline}\n"
            f"--------------------------------------------------\n\n"
            f"Our technical team will prepare a formal estimate including subsidy eligibility guidance and reach out to you.\n\n"
            f"Need assistance? Call us:\n"
            f"+91 7972908815 / +91 8317711711\n\n"
            f"Best regards,\n"
            f"Amulya Agrotech (P) Ltd\n"
        )
        success_customer, error_customer = dispatch_email(customer_email, cust_subject, cust_body)
        if not success_customer:
            logger.warning("Customer quotation confirmation delivery failed: %s", error_customer)
            return True, "Quotation received, but its confirmation email could not be delivered."
    else:
        return True, "Quotation received; the business notification was delivered."

    return True, "Quotation request received and email notifications delivered successfully"
