from recommendation_agent.agent import RecommendationAgent
from recommendation_agent.embeddings import FakeEmbedder
from recommendation_agent.models import Story
from recommendation_agent.repository import InMemoryStoryRepository

def test_publish_search_unpublish_lifecycle_and_edges():
    repo = InMemoryStoryRepository(); agent = RecommendationAgent(repo, FakeEmbedder())
    assert agent.search(" ").primary is None
    published = Story(7, "La forêt bleue", "Une aventure magique dans la forêt.", ["Fantasy"], ["foret"], author_id=7)
    repo.upsert(published); agent.upsert_story(published)
    assert agent.search("FORET").primary.id == 7
    assert agent.search("x" * 10000, k=0).recommendations == []
    unpublished = Story(**{**published.__dict__, "status": "draft"})
    repo.upsert(unpublished); agent.upsert_story(unpublished)
    assert agent.search("forêt").primary is None
