from conftest import auth_header, register


def publish_story(client, token, title="Moon Garden", genre="Fantasy", tag="dragons", blurb="A dragon adventure in a moonlit garden."):
    created = client.post("/api/stories", headers=auth_header(token), json={
        "title": title, "blurb": blurb, "status": "draft", "genres": [genre], "tags": [tag], "warnings": [],
    })
    assert created.status_code == 201
    story_id = created.json["story"]["id"]
    chapter = client.post(f"/api/stories/{story_id}/chapters", headers=auth_header(token), json={
        "title": "Beginning", "content": blurb, "status": "published",
    })
    assert chapter.status_code == 201
    return story_id


def test_recommendation_search_validation_and_visibility(client):
    author = register(client, "recommend-author@example.com", "recommend-author").json["token"]
    story_id = publish_story(client, author)
    assert client.get("/api/recommendations/search").status_code == 400
    assert client.get("/api/recommendations/search?q=x&limit=21").status_code == 400
    response = client.get("/api/recommendations/search?q=Moon%20Garden")
    assert response.status_code == 200
    assert response.json["primary"]["id"] == story_id
    assert response.json["match_type"] == "exact_title"
    assert client.get(f"/api/stories/{story_id}/similar").status_code == 200


def test_recommendation_hides_drafts_and_excludes_reader_shelves(client):
    author = register(client, "recommend-shelf-author@example.com", "recommend-shelf-author").json["token"]
    reader = register(client, "recommend-reader@example.com", "recommend-reader", "reader").json["token"]
    primary = publish_story(client, author, title="Dragon Moon")
    recommendation = publish_story(client, author, title="Dragon Forest")
    draft = client.post("/api/stories", headers=auth_header(author), json={
        "title": "Secret Dragon", "blurb": "A private dragon adventure.", "status": "draft",
    }).json["story"]["id"]
    assert client.put(f"/api/stories/{recommendation}/shelf", headers=auth_header(reader), json={"shelf": "Finished"}).status_code == 200
    result = client.get("/api/recommendations/search?q=Dragon%20Moon", headers=auth_header(reader)).json
    assert result["primary"]["id"] == primary
    assert recommendation not in {row["story"]["id"] for row in result["recommendations"]}
    assert draft not in {result["primary"]["id"], *[row["story"]["id"] for row in result["recommendations"]]}


def test_why_falls_back_and_story_lifecycle_syncs_search(client):
    author = register(client, "recommend-life-author@example.com", "recommend-life-author").json["token"]
    story_id = publish_story(client, author, title="French Étoile", genre="Romance", tag="slowburn", blurb="A slow romance in a small town.")
    for query in ("French Étoile", "Romance", "#slowburn", "small town romance"):
        result = client.get("/api/recommendations/search", query_string={"q": query})
        assert result.status_code == 200
        assert result.json["primary"] and result.json["primary"]["id"] == story_id
    why = client.post("/api/recommendations/why", json={"query": "romance", "story_ids": [story_id]})
    assert why.status_code == 200
    assert why.json["why"][str(story_id)]["source"] == "template"
    assert client.post("/api/recommendations/why", json={"query": "", "story_ids": list(range(21))}).status_code == 400
    assert client.put(f"/api/stories/{story_id}", headers=auth_header(author), json={
        "title": "French Étoile", "blurb": "A slow romance in a small town.", "status": "draft", "genres": ["Romance"], "tags": ["slowburn"], "warnings": [],
    }).status_code == 200
    gone = client.get("/api/recommendations/search?q=French%20%C3%89toile")
    assert gone.status_code == 200 and gone.json["primary"] is None
