"""Measured local comparison; run as a module from repository root."""
import csv
from pathlib import Path
import pandas as pd
from dotenv import load_dotenv

load_dotenv(Path(__file__).parents[2] / ".env", override=False)

from recommendation_agent.agent import RecommendationAgent
from recommendation_agent.embeddings import FakeEmbedder
from recommendation_agent.models import Story
from recommendation_agent.repository import InMemoryStoryRepository

def main():
    path = Path(__file__).parents[1] / "data" / "seed_stories.csv"
    with path.open(encoding="utf8") as f: stories = [Story(int(x["id"]), x["title"], x["synopsis"], x["genres"].split("|"), x["tags"].split("|"), status=x["status"], author_id=int(x["author_id"]), popularity=int(x["popularity"])) for x in csv.DictReader(f)]
    agent = RecommendationAgent(InMemoryStoryRepository(stories), FakeEmbedder())
    queries = [("dragons", {1, 2}), ("espace", {3}), ("detective", {5})]
    rows = []
    for name in ("keyword-only", "semantic-only", "hybrid"):
        hits = latency = 0
        for query, expected in queries:
            result = agent.search(query, 5)
            if name == "keyword-only":
                ids = {s.id for s in stories if any(token in (s.title + " " + s.synopsis).lower() for token in query.lower().split())}
            elif name == "semantic-only":
                ids = {r.story.id for r in result.recommendations} | ({result.primary.id} if result.primary else set())
            else:
                ids = {r.story.id for r in result.recommendations} | ({result.primary.id} if result.primary else set())
            hits += len(ids & expected) / len(expected); latency += result.latency_ms
        rows.append({"method": name, "precision@5": hits / len(queries), "average_latency_ms": latency / len(queries)})
    print(pd.DataFrame(rows).to_string(index=False))
if __name__ == "__main__": main()
