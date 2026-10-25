import io
import os
import time
import uuid
import requests
from PIL import Image

BASE = os.getenv("LEAF_API_URL", "http://localhost:5000/api")


def image_file(color="green"):
    stream = io.BytesIO()
    Image.new("RGB", (24, 24), color).save(stream, format="PNG")
    stream.seek(0)
    return stream


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def post(path, token=None, **kwargs):
    headers = kwargs.pop("headers", {})
    if token:
        headers["Authorization"] = f"Bearer {token}"
    res = requests.post(BASE + path, headers=headers, timeout=20, **kwargs)
    check(res.status_code < 400, f"POST {path} failed: {res.status_code} {res.text}")
    return res.json()


def put(path, token=None, **kwargs):
    headers = kwargs.pop("headers", {})
    if token:
        headers["Authorization"] = f"Bearer {token}"
    res = requests.put(BASE + path, headers=headers, timeout=20, **kwargs)
    check(res.status_code < 400, f"PUT {path} failed: {res.status_code} {res.text}")
    return res.json()


def get(path, token=None, **kwargs):
    headers = kwargs.pop("headers", {})
    if token:
        headers["Authorization"] = f"Bearer {token}"
    res = requests.get(BASE + path, headers=headers, timeout=20, **kwargs)
    check(res.status_code < 400, f"GET {path} failed: {res.status_code} {res.text}")
    return res.json()


def main():
    suffix = uuid.uuid4().hex[:8]
    for _ in range(20):
        try:
            get("/stats")
            break
        except Exception:
            time.sleep(1)
    author = post("/auth/register", json={"email": f"author-{suffix}@leaf.test", "username": f"author{suffix}", "password": "Password123!", "confirm_password": "Password123!", "role": "author"})
    reader = post("/auth/register", json={"email": f"reader-{suffix}@leaf.test", "username": f"reader{suffix}", "password": "Password123!", "confirm_password": "Password123!", "role": "reader"})
    at, rt = author["token"], reader["token"]
    story = post("/stories", at, json={"title": f"Smoke Story {suffix}", "blurb": "A live smoke test story with enough detail.", "status": "published", "genres": ["Fantasy"], "tags": ["smoke"], "warnings": [], "mature": False})["story"]
    post(f"/stories/{story['id']}/cover", at, files={"image": ("cover.png", image_file(), "image/png")})
    chapter = post(f"/stories/{story['id']}/chapters", at, json={"title": "Opening", "content": "<p>One bright test chapter arrives.</p>", "status": "draft"})["chapter"]
    put(f"/chapters/{chapter['id']}", at, json={"title": "Opening Revised", "content": "<p>One bright revised test chapter arrives.</p>", "status": "published"})
    explored = get("/stories", params={"q": f"Smoke Story {suffix}"})
    check(any(item["id"] == story["id"] for item in explored["items"]), "Published story was not visible in Explore.")
    comment = post(f"/stories/{story['id']}/comments", rt, json={"body": "A reader comment from smoke test."})["comment"]
    put(f"/stories/{story['id']}/shelf", rt, json={"shelf": "Reading"})
    put(f"/stories/{story['id']}/bookmark", rt, json={"chapter_id": chapter["id"]})
    put(f"/comments/{comment['id']}/hide", at, json={"hidden": True})
    notebook = post("/notebooks", at, json={"title": f"Smoke Notebook {suffix}", "story_id": story["id"]})["notebook"]
    post(f"/notebooks/{notebook['id']}/notes", at, json={"title": "Smoke Note", "content": "A note created through the API.", "color": "#FDF8EC", "pinned": True})
    post(f"/notebooks/{notebook['id']}/mood-items/image", at, files={"image": ("mood.png", image_file("blue"), "image/png")})
    get("/me/dashboard", at)
    print("Smoke test passed.")


if __name__ == "__main__":
    main()
