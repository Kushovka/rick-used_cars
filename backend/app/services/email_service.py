import logging
import smtplib
from email.message import EmailMessage
from html import escape

from app.core.config import settings
from app.schemas.lead import LeadCreate

logger = logging.getLogger("uvicorn.error")


def _smtp_configured() -> bool:
    return bool(settings.SMTP_HOST and settings.MAIL_FROM and settings.MAIL_TO)


def _build_lead_subject(payload: LeadCreate) -> str:
    if payload.subject:
        return f"New Rick's Used Cars Lead - {payload.subject}"
    return f"New Rick's Used Cars Lead - {payload.lead_type.title()}"


def _format_phone(value: str) -> str:
    digits = "".join(character for character in value if character.isdigit())
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"

    return value


def _value(value: object | None) -> str:
    return str(value).strip() if value not in (None, "") else "Not provided"


def _html_value(value: object | None) -> str:
    return escape(_value(value))


def _text_rows(rows: list[tuple[str, object | None]]) -> list[str]:
    return [f"{label}: {_value(value)}" for label, value in rows]


def _html_rows(rows: list[tuple[str, object | None]]) -> str:
    return "".join(
        f"""
        <tr>
          <td style="padding:8px 12px;color:#64748b;font-size:13px;border-bottom:1px solid #e5e7eb;">{escape(label)}</td>
          <td style="padding:8px 12px;color:#111827;font-size:14px;font-weight:600;border-bottom:1px solid #e5e7eb;">{_html_value(value)}</td>
        </tr>
        """
        for label, value in rows
    )


def _section(title: str, rows: list[tuple[str, object | None]]) -> str:
    return f"""
    <h2 style="margin:24px 0 10px;font-size:18px;line-height:1.3;color:#111827;">{escape(title)}</h2>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      {_html_rows(rows)}
    </table>
    """


def _customer_rows(payload: LeadCreate) -> list[tuple[str, object | None]]:
    return [
        ("Lead type", payload.lead_type.replace("-", " ").title()),
        ("Name", payload.customer_name),
        ("Phone", _format_phone(payload.phone)),
        ("Email", payload.email),
        ("Subject", payload.subject),
        ("Preferred contact", payload.preferred_contact),
        ("ZIP code", payload.zip_code),
    ]


def _tracking_rows(payload: LeadCreate) -> list[tuple[str, object | None]]:
    return [
        ("Vehicle ID", payload.vehicle_id or "General request"),
        ("Content name", payload.content_name),
        ("Source page", payload.source_page),
        ("Event URL", payload.event_source_url),
    ]


def _trade_rows(payload: LeadCreate) -> list[tuple[str, object | None]]:
    return [
        ("Make", payload.trade_make),
        ("Model", payload.trade_model),
        ("Year", payload.trade_year),
        ("Mileage", payload.trade_mileage),
        ("VIN", payload.trade_vin),
        ("Condition", payload.trade_condition),
    ]


def _build_lead_text(payload: LeadCreate) -> str:
    lines = [
        "New lead received from the website.",
        "",
        "Customer:",
        *_text_rows(_customer_rows(payload)),
    ]

    if payload.lead_type == "trade-in":
        lines.extend([
            "",
            "Trade-in vehicle:",
            *_text_rows(_trade_rows(payload)),
        ])

    lines.extend([
        "",
        "Tracking:",
        *_text_rows(_tracking_rows(payload)),
        "",
        "Message:",
        payload.message or "No message provided.",
    ])

    return "\n".join(lines)


def _build_lead_html(payload: LeadCreate) -> str:
    message = escape(payload.message or "No message provided.").replace("\n", "<br>")
    trade_section = _section("Trade-In Vehicle", _trade_rows(payload)) if payload.lead_type == "trade-in" else ""

    return f"""
    <div style="margin:0;background:#f8fafc;padding:24px;font-family:Arial,sans-serif;color:#111827;">
      <div style="margin:0 auto;max-width:680px;border:1px solid #e5e7eb;border-radius:12px;background:#ffffff;padding:24px;">
        <p style="margin:0 0 6px;color:#1d4ed8;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">Rick&apos;s Used Cars</p>
        <h1 style="margin:0;font-size:24px;line-height:1.25;color:#111827;">New Website Lead</h1>
        <p style="margin:8px 0 0;color:#64748b;font-size:14px;">A new {escape(payload.lead_type.replace("-", " ").title())} request was submitted from the website.</p>
        {_section("Customer", _customer_rows(payload))}
        {trade_section}
        <h2 style="margin:24px 0 10px;font-size:18px;line-height:1.3;color:#111827;">Message</h2>
        <div style="border:1px solid #e5e7eb;border-radius:8px;background:#f8fafc;padding:14px;color:#111827;font-size:14px;line-height:1.6;">{message}</div>
        {_section("Website Context", _tracking_rows(payload))}
      </div>
    </div>
    """


def send_lead_email(payload: LeadCreate) -> None:
    if not _smtp_configured():
        logger.warning("Lead email skipped: SMTP settings are missing")
        return

    message = EmailMessage()
    message["From"] = settings.MAIL_FROM
    message["To"] = settings.MAIL_TO
    message["Subject"] = _build_lead_subject(payload)
    if payload.email:
        message["Reply-To"] = str(payload.email)
    message.set_content(_build_lead_text(payload))
    message.add_alternative(_build_lead_html(payload), subtype="html")

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as client:
            client.ehlo()
            if settings.SMTP_USE_TLS:
                client.starttls()
                client.ehlo()
            if settings.SMTP_USERNAME:
                client.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            client.send_message(message)
        logger.info("Lead email sent via SMTP to %s", settings.MAIL_TO)
    except Exception:
        logger.exception("Could not send lead email via SMTP")
