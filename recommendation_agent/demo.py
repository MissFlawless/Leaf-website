"""Run: python -m recommendation_agent.demo 'dark fantasy'."""
import csv
from pathlib import Path
import sys
from dotenv import load_dotenv

load_dotenv(Path(__file__).parents[1] / ".env", override=False)

from .agent import RecommendationAgent
from .embeddings import FakeEmbedder
from .models import Story
from .repository import InMemoryStoryRepository

def main():
    with (Path(__file__).parent / "data" / "seed_stories.csv").open(encoding="utf8") as f:
        stories = [Story(int(r["id"]), r["title"], r["synopsis"], r["genres"].split("|"), r["tags"].split("|"), status=r["status"], author_id=int(r["author_id"]), author_name=r["author_name"], popularity=int(r["popularity"])) for r in csv.DictReader(f)]
    result = RecommendationAgent(InMemoryStoryRepository(stories), FakeEmbedder()).search(" ".join(sys.argv[1:]) or "fantasy")
    print(f"Best match: {result.primary.title if result.primary else 'none'}")
    for rec in result.recommendations: print(f"- {rec.story.title}: {rec.reasons}")
if __name__ == "__main__": main()
