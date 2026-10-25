import io
import sys
from pathlib import Path
import pytest
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app import create_app
from app.config import TestConfig
from app.extensions import db
from app.models import ContentWarning, Genre


@pytest.fixture()
def app():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        db.session.add_all([Genre(name="Fantasy"), Genre(name="Mystery"), ContentWarning(name="Violence")])
        db.session.commit()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


def register(client, email, username, role="author"):
    return client.post("/api/auth/register", json={"email": email, "username": username, "password": "Password123!", "confirm_password": "Password123!", "role": role})


def auth_header(token):
    return {"Authorization": f"Bearer {token}"}


def image_bytes():
    file = io.BytesIO()
    Image.new("RGB", (10, 10), "red").save(file, format="PNG")
    file.seek(0)
    return file
