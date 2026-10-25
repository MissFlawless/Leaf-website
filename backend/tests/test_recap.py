from datetime import datetime, timedelta

from conftest import auth_header, register
from app.extensions import db
from app.models import ReadingSession


def create_published_story(client, author_token):
    response = client.post("/api/stories", headers=auth_header(author_token), json={
        "title": "The Glass Cartographer",
        "blurb": "Mira finds a map hidden inside antique glass.",
        "status": "draft",
        "genres": ["Fantasy"],
        "tags": ["maps"],
        "warnings": [],
    })
    assert response.status_code == 201
    story_id = response.json["story"]["id"]
    response = client.post(f"/api/stories/{story_id}/chapters", headers=auth_header(author_token), json={
        "title": "The Map",
        "content": "Mira discovered a map hidden in antique glass. The map showed a kingdom absent from every atlas.",
        "status": "published",
    })
    assert response.status_code == 201
    return story_id, response.json["chapter"]["id"]


def test_recap_requires_auth_and_validates_story_id(client):
    assert client.get("/api/recap/check").status_code == 401
    reader = register(client, "recap-reader@example.com", "recap-reader", role="reader").json["token"]
    response = client.get("/api/recap/check", headers=auth_header(reader))
    assert response.status_code == 400


def test_reader_progress_and_return_recap(client, app):
    app.config["GEMINI_API_KEY"] = ""
    author = register(client, "recap-author@example.com", "recap-author").json["token"]
    reader = register(client, "recap-user@example.com", "recap-user", role="reader").json["token"]
    story_id, chapter_id = create_published_story(client, author)

    saved = client.put("/api/recap/progress", headers=auth_header(reader), json={
        "story_id": story_id, "chapter_id": chapter_id, "position": 18,
    })
    assert saved.status_code == 200 and saved.json["saved"] is True

    with app.app_context():
        session = ReadingSession.query.filter_by(story_id=story_id).one()
        session.updated_at = datetime.utcnow() - timedelta(seconds=4)
        db.session.commit()

    recap = client.get(f"/api/recap/check?story_id={story_id}", headers=auth_header(reader))
    assert recap.status_code == 200
    assert recap.json["should_recap"] is True
    assert recap.json["generator"] == "extractive"
    assert "Mira" in recap.json["summary"]


def test_recap_progress_rejects_chapter_from_another_story(client):
    author = register(client, "recap-validation@example.com", "recap-validation").json["token"]
    reader = register(client, "recap-validation-reader@example.com", "recap-validation-reader", role="reader").json["token"]
    story_id, chapter_id = create_published_story(client, author)
    response = client.put("/api/recap/progress", headers=auth_header(reader), json={
        "story_id": story_id + 100, "chapter_id": chapter_id,
    })
    assert response.status_code == 404
