import os


class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL", "")
    DB_USER = os.getenv("POSTGRES_USER", "kirill")
    DB_PASS = os.getenv("POSTGRES_PASSWORD", "kirill")
    DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
    DB_PORT = os.getenv("POSTGRES_PORT", "5433")
    DB_NAME = os.getenv("POSTGRES_DB", "ricks_used_cars_db")
    BACKEND_CORS_ORIGINS = os.getenv(
        "BACKEND_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:5188,http://127.0.0.1:5188,http://localhost:3000,http://127.0.0.1:3000",
    )
    META_PIXEL_ID = os.getenv("META_PIXEL_ID", "")
    META_ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN", "")
    MAIL_FROM = os.getenv("MAIL_FROM", "")
    MAIL_TO = os.getenv("MAIL_TO", "")
    SMTP_HOST = os.getenv("SMTP_HOST", "")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
    SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "true").lower() in {"1", "true", "yes"}
    GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY", "")
    GOOGLE_PLACE_ID = os.getenv("GOOGLE_PLACE_ID", "")

    @property
    def DB_URL(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

        return (
            f"postgresql+psycopg://{self.DB_USER}:"
            f"{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.BACKEND_CORS_ORIGINS.split(",")
            if origin.strip()
        ]


settings = Settings()
