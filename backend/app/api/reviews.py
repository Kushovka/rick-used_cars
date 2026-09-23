from fastapi import APIRouter

from app.schemas.review import GoogleReview
from app.services.google_reviews import get_google_reviews


router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/google", response_model=list[GoogleReview])
def google_reviews():
    return get_google_reviews()
