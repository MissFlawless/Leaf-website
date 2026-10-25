from conftest import auth_header, image_bytes, register


def test_register_login(client):
    res = register(client, "a@example.com", "author")
    assert res.status_code == 201
    login = client.post("/api/auth/login", json={"email": "a@example.com", "password": "Password123!"})
    assert login.status_code == 200
    assert login.json["token"]


def test_story_chapter_crud_and_permissions(client):
    author = register(client, "a@example.com", "author").json["token"]
    other = register(client, "b@example.com", "other").json["token"]
    reader = register(client, "r@example.com", "reader", "reader").json["token"]
    forbidden = client.post("/api/stories", headers=auth_header(reader), json={"title": "No", "blurb": "Readers cannot create", "genres": []})
    assert forbidden.status_code == 403
    story = client.post("/api/stories", headers=auth_header(author), json={"title": "A Real Story", "blurb": "A proper blurb for tests.", "status": "draft", "genres": ["Fantasy"], "tags": ["test"], "warnings": []})
    assert story.status_code == 201
    story_id = story.json["story"]["id"]
    denied = client.put(f"/api/stories/{story_id}", headers=auth_header(other), json={"title": "Taken", "blurb": "A proper blurb for tests.", "status": "draft"})
    assert denied.status_code == 403
    chapter = client.post(f"/api/stories/{story_id}/chapters", headers=auth_header(author), json={"title": "One", "content": "<p>Hello world</p>", "status": "draft"})
    assert chapter.status_code == 201
    chapter_id = chapter.json["chapter"]["id"]
    update = client.put(f"/api/chapters/{chapter_id}", headers=auth_header(author), json={"content": "<p>Hello <strong>again</strong></p>", "status": "published"})
    assert update.status_code == 200
    delete = client.delete(f"/api/chapters/{chapter_id}", headers=auth_header(author))
    assert delete.status_code == 200


def test_upload_rejects_non_image(client):
    token = register(client, "a@example.com", "author").json["token"]
    story = client.post("/api/stories", headers=auth_header(token), json={"title": "Upload Story", "blurb": "A proper blurb for tests.", "status": "draft"})
    bad = client.post(f"/api/stories/{story.json['story']['id']}/cover", headers=auth_header(token), data={"image": (b"not image", "bad.png")}, content_type="multipart/form-data")
    assert bad.status_code == 400


def test_valid_upload(client):
    token = register(client, "a@example.com", "author").json["token"]
    story = client.post("/api/stories", headers=auth_header(token), json={"title": "Upload Story", "blurb": "A proper blurb for tests.", "status": "draft"})
    ok = client.post(f"/api/stories/{story.json['story']['id']}/cover", headers=auth_header(token), data={"image": (image_bytes(), "ok.png")}, content_type="multipart/form-data")
    assert ok.status_code == 200
    assert ok.json["story"]["cover_url"]


def test_publishing_first_chapter_makes_story_visible_to_everyone(client):
    author = register(client, "author@example.com", "author")
    token = author.json["token"]
    story = client.post("/api/stories", headers=auth_header(token), json={
        "title": "Newly Published", "blurb": "A published story for readers.", "status": "draft",
    })
    story_id = story.json["story"]["id"]
    premature_publish = client.put(f"/api/stories/{story_id}", headers=auth_header(token), json={
        "title": "Newly Published", "blurb": "A published story for readers.", "status": "published",
    })
    assert premature_publish.status_code == 400

    chapter = client.post(f"/api/stories/{story_id}/chapters", headers=auth_header(token), json={
        "title": "Chapter One", "content": "The story begins.", "status": "published",
    })
    assert chapter.status_code == 201

    for headers in ({}, auth_header(token)):
        visible = client.get("/api/stories", headers=headers)
        assert story_id in {item["id"] for item in visible.json["items"]}
    detail = client.get(f"/api/stories/{story_id}")
    assert detail.status_code == 200
    assert detail.json["chapters"][0]["title"] == "Chapter One"


def test_chapter_content_requires_login_and_story_updates_notify_followers(client):
    author = register(client, "notify-author@example.com", "author")
    reader = register(client, "notify-reader@example.com", "reader", "reader")
    author_headers, reader_headers = auth_header(author.json["token"]), auth_header(reader.json["token"])
    story = client.post("/api/stories", headers=author_headers, json={
        "title": "A Notified Story", "blurb": "A story readers can follow for updates.", "status": "draft",
    }).json["story"]
    chapter = client.post(f"/api/stories/{story['id']}/chapters", headers=author_headers, json={
        "title": "Beginning", "content": "A beginning for our reader.", "status": "published",
    }).json["chapter"]

    assert client.get(f"/api/chapters/{chapter['id']}").status_code == 401
    assert client.put(f"/api/stories/{story['id']}/shelf", headers=reader_headers, json={"shelf": "Reading"}).status_code == 200
    assert client.put(f"/api/chapters/{chapter['id']}", headers=author_headers, json={
        "title": "Beginning", "content": "A newly revised beginning for our reader.", "status": "published",
    }).status_code == 200
    notifications = client.get("/api/notifications", headers=reader_headers)
    assert notifications.status_code == 200
    assert notifications.json["unread_count"] == 1
    assert notifications.json["items"][0]["chapter_id"] == chapter["id"]


def test_profile_avatar_and_cover_are_returned_and_served(client):
    token = register(client, "profile@example.com", "profile").json["token"]
    headers = auth_header(token)
    for route, field in (("/api/users/me/avatar", "avatar_url"), ("/api/users/me/cover", "cover_url")):
        response = client.post(route, headers=headers, data={"image": (image_bytes(), "profile.png")}, content_type="multipart/form-data")
        assert response.status_code == 200
        image_url = response.json["user"][field]
        assert image_url
        assert client.get(image_url).status_code == 200
