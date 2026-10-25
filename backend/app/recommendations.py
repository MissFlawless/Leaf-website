"""Leaf-specific persistence, caching, and API helpers for recommendation_agent."""
from __future__ import annotations

from hashlib import sha256
import logging
from pathlib import Path
import sys

import numpy as np
from sqlalchemy.orm import joinedload, selectinload

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from recommendation_agent.agent import RecommendationAgent
from recommendation_agent.config import RankingConfig
from recommendation_agent.embeddings import FakeEmbedder, SentenceTransformerEmbedder
from recommendation_agent.index import VectorIndex
from recommendation_agent.models import Story as AgentStory
from recommendation_agent.prompts import public_story_context
from recommendation_agent.text_utils import embedding_text

from app.extensions import db
from app.models import Chapter, Story, StoryEmbedding
from app.utils.serializers import upload_url

log = logging.getLogger(__name__)
PUBLISHED = {"published", "completed"}


class PostgresStoryRepository:
    """A database-loaded, in-memory snapshot used by all recommendation searches."""
    def __init__(self):
        self._stories: dict[int, AgentStory] = {}

    def list_stories(self):
        return list(self._stories.values())

    def get_story(self, story_id):
        return self._stories.get(story_id)

    def _map(self, story: Story) -> AgentStory:
        synopsis = (story.blurb or "").strip()
        if not synopsis:
            chapter = next((item for item in story.chapters if item.status == "published"), None)
            synopsis = (chapter.content or "")[:500] if chapter else ""
        return AgentStory(
            id=story.id, title=story.title, synopsis=synopsis[:500],
            genres=[genre.name for genre in story.genres],
            tags=[tag.name.lstrip("#") for tag in story.tags],
            content_warnings=[warning.name for warning in story.warnings],
            author_id=story.author_id, author_name=story.author.display_name or story.author.username,
            status="published" if story.status in PUBLISHED else story.status,
            cover_url=upload_url(story.cover), popularity=0, updated_at=story.updated_at,
        )

    def refresh(self):
        rows = Story.query.options(
            joinedload(Story.author), selectinload(Story.genres), selectinload(Story.tags),
            selectinload(Story.warnings), selectinload(Story.chapters),
        ).join(Chapter).filter(Story.status.in_(PUBLISHED), Chapter.status == "published").distinct().all()
        self._stories = {story.id: self._map(story) for story in rows}
        return self.list_stories()

    def refresh_story(self, story_id):
        story = Story.query.options(
            joinedload(Story.author), selectinload(Story.genres), selectinload(Story.tags),
            selectinload(Story.warnings), selectinload(Story.chapters),
        ).filter_by(id=story_id).first()
        if not story or story.status not in PUBLISHED or not any(chapter.status == "published" for chapter in story.chapters):
            self._stories.pop(story_id, None)
            return None
        value = self._map(story)
        self._stories[story_id] = value
        return value

    def remove(self, story_id):
        self._stories.pop(story_id, None)


class RecommendationService:
    def __init__(self, testing=False):
        self.repository = PostgresStoryRepository()
        self.config = RankingConfig()
        self.embedder = FakeEmbedder() if testing else SentenceTransformerEmbedder(self.config.embedding_model)
        from recommendation_agent.explain import WhyLineGenerator
        # Tests intentionally exercise the deterministic template path without network access.
        why_generator = None if testing else WhyLineGenerator()
        self.agent = RecommendationAgent(self.repository, self.embedder, self.config, why_generator, rebuild=False)
        self.refresh()

    def _digest(self, story):
        return sha256(embedding_text(story).encode()).hexdigest()

    def refresh(self):
        stories = self.repository.refresh()
        if not stories:
            self.agent.index, self.agent._hashes = None, {}
            return
        stored = {row.story_id: row for row in StoryEmbedding.query.filter(StoryEmbedding.story_id.in_([story.id for story in stories])).all()}
        vectors, missing = {}, []
        for story in stories:
            digest = self._digest(story)
            row = stored.get(story.id)
            if row and row.model_name == self.config.embedding_model and row.content_hash == digest:
                vector = np.frombuffer(row.embedding, dtype=np.float32)
                if vector.size:
                    vectors[story.id] = vector
                    continue
            missing.append((story, digest))
        if missing:
            encoded = self.embedder.encode([embedding_text(story) for story, _ in missing])
            for (story, digest), vector in zip(missing, encoded):
                vector = np.asarray(vector, dtype=np.float32)
                vectors[story.id] = vector
                row = stored.get(story.id)
                if row is None:
                    row = StoryEmbedding(story_id=story.id)
                    db.session.add(row)
                row.model_name, row.content_hash, row.embedding = self.config.embedding_model, digest, vector.tobytes()
            db.session.commit()
        first = next(iter(vectors.values()), None)
        if first is None:
            self.agent.index, self.agent._hashes = None, {}
            return
        self.agent.index, self.agent._hashes = VectorIndex(len(first)), {}
        for story in stories:
            self.agent.upsert_story(story, vectors[story.id])

    def sync_story(self, story_id):
        """Refresh one snapshot entry. Errors are deliberately non-fatal to writes."""
        try:
            story = self.repository.refresh_story(story_id)
            if story is None:
                self.agent.remove_story(story_id)
                return
            digest = self._digest(story)
            if self.agent._hashes.get(story.id) == digest:
                return
            vector = np.asarray(self.embedder.encode([embedding_text(story)])[0], dtype=np.float32)
            self.agent.upsert_story(story, vector)
            row = db.session.get(StoryEmbedding, story.id) or StoryEmbedding(story_id=story.id)
            row.model_name, row.content_hash, row.embedding = self.config.embedding_model, digest, vector.tobytes()
            db.session.add(row)
            db.session.commit()
        except Exception:
            db.session.rollback()
            log.exception("Recommendation sync failed for story %s", story_id)

    def remove_story(self, story_id):
        self.repository.remove(story_id)
        self.agent.remove_story(story_id)

    def why(self, query, story_ids):
        result = self.agent.search(query, k=20)
        primary = result.primary
        output = {}
        for story_id in story_ids:
            story = self.repository.get_story(story_id)
            if not story:
                continue
            fallback = "A close match for your search."
            if self.agent.why_generator:
                context = public_story_context(primary or story, story)
                text, source = self.agent.why_generator.generate_with_source(
                    result.normalized_query, story.id, self.agent._hashes.get(story.id, ""), context, fallback
                )
            else:
                text, source = fallback, "template"
            output[str(story_id)] = {"text": text, "source": source}
        return output


def initialize_recommendations(app):
    try:
        with app.app_context():
            app.extensions["recommendations"] = RecommendationService(testing=app.config.get("TESTING", False))
    except Exception:
        app.extensions["recommendations"] = None
        log.exception("Recommendation service initialization failed")


def get_recommendations(app):
    return app.extensions.get("recommendations")
