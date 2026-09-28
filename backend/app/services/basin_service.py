import logging
from collections.abc import Mapping
from urllib import parse, request
from urllib.error import HTTPError

from app.core.config import settings
from app.schemas.lead import LeadCreate

logger = logging.getLogger("uvicorn.error")


def _value(value: object | None) -> str:
    return str(value).strip() if value not in (None, "") else ""


def send_lead_to_basin(
    payload: LeadCreate,
    request_headers: Mapping[str, str] | None = None,
) -> None:
    """Forward a saved lead without exposing the Basin endpoint to browsers."""
    if not settings.BASIN_FORM_ACTION:
        logger.warning("UseBasin lead forwarding skipped: BASIN_FORM_ACTION is missing")
        return

    name_parts = payload.customer_name.split(maxsplit=1)
    fields = {
        "first_name": name_parts[0] if name_parts else "",
        "last_name": name_parts[1] if len(name_parts) > 1 else "",
        "name": payload.customer_name,
        "email": _value(payload.email),
        "phone": payload.phone,
        "subject": _value(payload.subject),
        "message": _value(payload.message),
        "preferred_contact": _value(payload.preferred_contact),
        "vehicle_id": _value(payload.vehicle_id),
        "lead_type": payload.lead_type,
        "source_page": _value(payload.source_page),
    }
    body = parse.urlencode(fields).encode("utf-8")
    basin_request = request.Request(
        settings.BASIN_FORM_ACTION,
        data=body,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            **{
                header: value
                for header in ("Origin", "Referer", "User-Agent")
                if request_headers and (value := request_headers.get(header.lower()))
            },
        },
        method="POST",
    )

    try:
        with request.urlopen(basin_request, timeout=10) as response:
            if response.status >= 400:
                raise RuntimeError(f"UseBasin returned HTTP {response.status}")
        logger.info("Lead forwarded to UseBasin")
    except HTTPError as error:
        logger.error("Could not forward lead to UseBasin: HTTP %s %s", error.code, error.reason)
    except Exception:
        # The dealership database remains the source of truth if the vendor is unavailable.
        logger.exception("Could not forward lead to UseBasin")
