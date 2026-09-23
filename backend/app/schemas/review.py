from pydantic import BaseModel


class GoogleReview(BaseModel):
    author: str
    rating: int
    text: str
    date: str | None = None
    publish_time: str | None = None
    author_url: str | None = None
    photo_url: str | None = None
