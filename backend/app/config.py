import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-change-me")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-change-me")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///leaf.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    _upload_setting = Path(os.getenv("UPLOAD_FOLDER", "uploads"))
    UPLOAD_FOLDER = str(_upload_setting if _upload_setting.is_absolute() else BASE_DIR / _upload_setting)
    MAX_CONTENT_LENGTH = 6 * 1024 * 1024
    # README's documented fallback Vite port is 5175. Both local hostnames
    # need access because browsers treat localhost and 127.0.0.1 as distinct origins.
    FRONTEND_ORIGIN = os.getenv(
        "FRONTEND_ORIGIN",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5175,http://127.0.0.1:5175",
    )


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv("TEST_DATABASE_URL", "sqlite:///:memory:")
    JWT_SECRET_KEY = "test-jwt-secret"
