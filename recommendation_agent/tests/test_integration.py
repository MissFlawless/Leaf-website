from recommendation_agent.agent import RecommendationAgent
from recommendation_agent.embeddings import FakeEmbedder
from recommendation_agent.models import Story
from recommendation_agent.repository import InMemoryStoryRepository

def catalog():
    return [
        Story(1, "Harry Potter", "A young wizard at magic school", ["Fantasy"], ["magic", "wizard"], author_id=1, popularity=5),
        Story(2, "Dragon Road", "Dragons and magic on a dangerous journey", ["Fantasy", "Adventure"], ["dragons", "magic"], author_id=2, popularity=4),
        Story(3, "Hidden Draft", "dragons", ["Fantasy"], ["dragons"], status="draft", author_id=3),
    ]

def agent(): return RecommendationAgent(InMemoryStoryRepository(catalog()), FakeEmbedder())

def test_title_genre_tag_and_description_queries():
    a = agent()
    assert a.search("harry poter").primary.id == 1
    assert a.search("Fantasy").intent == "GENRE"
    assert a.search("#dragons").intent == "TAG"
    assert a.search("dangerous magic journey").primary.id in {1, 2}

def test_filters_and_primary_is_not_recommended():
    result = agent().search("Harry Potter", exclude_story_ids=[2])
    assert all(r.story.id != result.primary.id and r.story.id != 2 for r in result.recommendations)
    # Easy to regress: draft content must not leak even when its text is a perfect match.
    assert all(r.story.status == "published" for r in result.recommendations)

def test_upsert_and_remove_change_index():
    a = agent(); replacement = Story(2, "Ocean Road", "deep ocean voyage", ["Adventure"], ["ocean"], author_id=2)
    a.repository.upsert(replacement); a.upsert_story(replacement)
    assert a.search("dragons").primary.id != 2
    a.repository.remove(2); a.remove_story(2)
    assert all(r.story.id != 2 for r in a.search("Harry Potter").recommendations)
