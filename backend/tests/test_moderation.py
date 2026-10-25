from conftest import auth_header, register


def create_test_story(client, author_token):
    res = client.post(
        "/api/stories",
        headers=auth_header(author_token),
        json={
            "title": "A Moderated Tale",
            "blurb": "Testing moderation functionality in Leaf.",
            "status": "draft",
            "genres": ["Fantasy"],
            "tags": ["test"],
            "warnings": [],
        },
    )
    assert res.status_code == 201
    story_id = res.json["story"]["id"]
    chapter = client.post(
        f"/api/stories/{story_id}/chapters",
        headers=auth_header(author_token),
        json={"title": "Prologue", "content": "<p>A peaceful beginning.</p>", "status": "published"},
    )
    assert chapter.status_code == 201
    return story_id, chapter.json["chapter"]["id"]


def test_benign_comment_approved(client):
    author = register(client, "author_mod@example.com", "author_mod").json["token"]
    reader = register(client, "reader_mod@example.com", "reader_mod", role="reader").json["token"]
    story_id, chapter_id = create_test_story(client, author)

    res = client.post(
        f"/api/stories/{story_id}/comments",
        headers=auth_header(reader),
        json={"body": "This chapter is beautifully written! I love the setting."},
    )
    assert res.status_code == 201
    assert not res.json["comment"]["hidden"]


def test_toxic_comment_flagged_and_notified(client):
    author = register(client, "author_flag@example.com", "author_flag").json["token"]
    reader = register(client, "reader_flag@example.com", "reader_flag", role="reader").json["token"]
    story_id, chapter_id = create_test_story(client, author)

    # Attempt to post severe toxic comment
    res = client.post(
        f"/api/stories/{story_id}/comments",
        headers=auth_header(reader),
        json={"body": "kill yourself you piece of shit author"},
    )
    assert res.status_code == 400
    assert "moderation" in res.json or "flagged" in res.json.get("error", "").lower()

    # Verify user received a moderation notification
    notifications = client.get("/api/notifications", headers=auth_header(reader))
    assert notifications.status_code == 200
    assert any(n["kind"] == "moderation" and "flagged" in n["title"].lower() for n in notifications.json["items"])


def test_spam_comment_flagged(client):
    author = register(client, "author_spam@example.com", "author_spam").json["token"]
    reader = register(client, "reader_spam@example.com", "reader_spam", role="reader").json["token"]
    story_id, _ = create_test_story(client, author)

    res = client.post(
        f"/api/stories/{story_id}/comments",
        headers=auth_header(reader),
        json={"body": "Earn $5,000 a day with our free crypto giveaway click here!"},
    )
    assert res.status_code == 400
    assert "moderation" in res.json or "flagged" in res.json.get("error", "").lower()


def test_borderline_comment_requires_review(client):
    author = register(client, "author_rev@example.com", "author_rev").json["token"]
    reader = register(client, "reader_rev@example.com", "reader_rev", role="reader").json["token"]
    story_id, _ = create_test_story(client, author)

    res = client.post(
        f"/api/stories/{story_id}/comments",
        headers=auth_header(reader),
        json={"body": "This author is an idiot and your story is trash."},
    )
    assert res.status_code == 201
    # Saved but hidden for review
    assert res.json["comment"]["hidden"]
    assert "review" in res.json.get("message", "").lower()

    # User received pending review notification
    user_notifs = client.get("/api/notifications", headers=auth_header(reader)).json["items"]
    assert any(n["kind"] == "moderation" and "review" in n["title"].lower() for n in user_notifs)

    # Author received a notification alerting them of a comment requiring review
    author_notifs = client.get("/api/notifications", headers=auth_header(author)).json["items"]
    assert any(n["kind"] == "moderation" and "review" in n["title"].lower() for n in author_notifs)


def test_toxic_chapter_publication_blocked(client):
    author = register(client, "author_chap@example.com", "author_chap").json["token"]
    story = client.post(
        "/api/stories",
        headers=auth_header(author),
        json={"title": "Dark Story", "blurb": "A test story.", "status": "draft", "genres": ["Fantasy"]},
    ).json["story"]

    res = client.post(
        f"/api/stories/{story['id']}/chapters",
        headers=auth_header(author),
        json={
            "title": "A Threat",
            "content": "<p>I will find you and kill you.</p>",
            "status": "published",
        },
    )
    assert res.status_code == 400
    assert "cannot be published" in res.json.get("error", "").lower()

    # Author receives notification that chapter was blocked
    author_notifs = client.get("/api/notifications", headers=auth_header(author)).json["items"]
    assert any(n["kind"] == "moderation" and "blocked" in n["title"].lower() for n in author_notifs)


def test_direct_moderation_check_endpoint(client):
    res = client.post("/api/moderation/check", json={"text": "A lovely sunny morning in the shire."})
    assert res.status_code == 200
    assert res.json["moderation"]["status"] == "approved"

    res_flag = client.post("/api/moderation/check", json={"text": "kys immediately"})
    assert res_flag.status_code == 200
    assert res_flag.json["moderation"]["status"] == "flagged"


def test_report_comment_and_story(client):
    author = register(client, "author_rep@example.com", "author_rep").json["token"]
    reader = register(client, "reader_rep@example.com", "reader_rep", role="reader").json["token"]
    story_id, _ = create_test_story(client, author)

    comment = client.post(
        f"/api/stories/{story_id}/comments",
        headers=auth_header(author),
        json={"body": "A normal author note."},
    ).json["comment"]

    # Reader reports the comment from the book details page
    rep = client.post(
        "/api/moderation/report-comment",
        headers=auth_header(reader),
        json={"comment_id": comment["id"], "reason": "Spam or irrelevant"},
    )
    assert rep.status_code == 200
    assert "reported" in rep.json["message"]

    # Reader reports the story from the book details page
    rep_story = client.post(
        "/api/moderation/report-story",
        headers=auth_header(reader),
        json={"story_id": story_id, "reason": "Contains misleading tags"},
    )
    assert rep_story.status_code == 200
    assert "submitted" in rep_story.json["message"]

