import json
import logging
from datetime import datetime, timedelta, timezone
from urllib.error import HTTPError
from urllib import request

from app.core.config import settings
from app.schemas.review import GoogleReview
from app.services.placeholder_data import PLACEHOLDER_REVIEWS

logger = logging.getLogger("uvicorn.error")

_cache_expires_at: datetime | None = None
_cache: list[GoogleReview] = []
_CACHE_TTL = timedelta(hours=6)


def _review_text(review: dict) -> str:
    text = review.get("text") or {}
    original_text = review.get("originalText") or {}
    return text.get("text") or original_text.get("text") or ""


def _map_review(review: dict) -> GoogleReview | None:
    rating = int(review.get("rating") or 0)
    text = _review_text(review).strip()
    author = review.get("authorAttribution") or {}

    if rating < 4 or not text:
        return None

    return GoogleReview(
        author=author.get("displayName") or "Google user",
        rating=rating,
        text=text,
        date=review.get("relativePublishTimeDescription"),
        publish_time=review.get("publishTime"),
        author_url=author.get("uri"),
        photo_url=author.get("photoUri"),
    )


def _publish_time(review: GoogleReview) -> datetime:
    if not review.publish_time:
        return datetime.min.replace(tzinfo=timezone.utc)

    try:
        return datetime.fromisoformat(review.publish_time.replace("Z", "+00:00"))
    except ValueError:
        return datetime.min.replace(tzinfo=timezone.utc)


def _fetch_google_reviews() -> list[GoogleReview] | None:
    api_request = request.Request(
        f"https://places.googleapis.com/v1/places/{settings.GOOGLE_PLACE_ID}",
        headers={
            "X-Goog-Api-Key": settings.GOOGLE_PLACES_API_KEY,
            "X-Goog-FieldMask": "reviews.authorAttribution,reviews.rating,reviews.text,reviews.originalText,reviews.relativePublishTimeDescription,reviews.publishTime",
            "Accept": "application/json",
        },
        method="GET",
    )

    try:
        with request.urlopen(api_request, timeout=8) as response:
            data = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        error_body = error.read().decode("utf-8", errors="replace")
        logger.error("Could not fetch Google reviews: HTTP %s %s", error.code, error_body)
        return None
    except Exception:
        logger.exception("Could not fetch Google reviews")
        return None

    reviews = [
        mapped
        for mapped in (_map_review(review) for review in data.get("reviews", []))
        if mapped is not None
    ]
    reviews.sort(key=_publish_time, reverse=True)
    return reviews


def get_google_reviews() -> list[GoogleReview]:
    global _cache_expires_at, _cache

    now = datetime.now(timezone.utc)
    if _cache_expires_at and now < _cache_expires_at:
        return _cache

    if not settings.GOOGLE_PLACES_API_KEY or not settings.GOOGLE_PLACE_ID:
        logger.warning("Google reviews skipped: GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID is missing")
        return PLACEHOLDER_REVIEWS

    reviews = _fetch_google_reviews()
    if reviews is None:
        return _cache or PLACEHOLDER_REVIEWS

    _cache = reviews
    _cache_expires_at = now + _CACHE_TTL
    return _cache or PLACEHOLDER_REVIEWS
