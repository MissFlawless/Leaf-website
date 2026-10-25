"""The framework-independent public recommendation API."""
from hashlib import sha256
from time import perf_counter
from .config import RankingConfig
from .embeddings import Embedder
from .index import VectorIndex
from .lexical import detect_intent
from .models import Recommendation, SearchResult, Story
from .ranking import jaccard, reason
from .text_utils import embedding_text, normalize
from .prompts import public_story_context


class RecommendationAgent:
    def __init__(self, repository, embedder: Embedder, config: RankingConfig | None = None, why_generator=None, rebuild: bool = True):
        self.repository, self.embedder = repository, embedder
        self.config, self.why_generator = config or RankingConfig(), why_generator
        self.index, self._hashes = None, {}
        if rebuild: self.rebuild()

    def _published(self): return [s for s in self.repository.list_stories() if s.status == "published"]
    def rebuild(self):
        stories = self._published()
        if not stories: self.index, self._hashes = None, {}; return
        vectors = self.embedder.encode([embedding_text(s) for s in stories])
        self.index = VectorIndex(vectors.shape[1]); self._hashes = {}
        for story, vector in zip(stories, vectors): self.upsert_story(story, vector)
        assert self.index.ntotal == len(stories)
    def upsert_story(self, story: Story, vector=None):
        if story.status != "published": return self.remove_story(story.id)
        text = embedding_text(story); digest = sha256(text.encode()).hexdigest()
        if self._hashes.get(story.id) == digest: return
        if vector is None: vector = self.embedder.encode([text])[0]
        if self.index is None: self.index = VectorIndex(len(vector))
        self.index.upsert(story.id, vector); self._hashes[story.id] = digest
    def remove_story(self, story_id: int):
        if self.index: self.index.remove(story_id)
        self._hashes.pop(story_id, None)
    def _empty(self, query, normalized, started):
        return SearchResult(query, normalized, None, None, [], False, (perf_counter()-started)*1000)
    def search(self, query: str, k: int = 8, exclude_story_ids=None, exclude_warnings=None) -> SearchResult:
        started = perf_counter(); query = query or ""; raw_query = query[:200]; normalized = normalize(raw_query)
        if not normalized or k <= 0: return self._empty(query, normalized, started)
        stories = self._published(); excluded = set(exclude_story_ids or []); warnings = {normalize(w) for w in exclude_warnings or []}
        stories = [s for s in stories if s.id not in excluded and not (warnings & {normalize(w) for w in s.content_warnings})]
        if not stories: return self._empty(query, normalized, started)
        intent, value = detect_intent(raw_query, stories); degraded = False
        vectors = {}
        try:
            query_vector = self.embedder.encode([raw_query])[0]
            vectors = {sid: v for sid, v in (self.index.vectors.items() if self.index else [])}
        except Exception:
            query_vector, degraded = None, True
        if intent == "TITLE": primary = value
        elif intent in ("GENRE", "TAG"):
            candidates = [s for s in stories if normalize(value) in {normalize(x) for x in (s.genres if intent == "GENRE" else s.tags)}]
            primary = self._semantic_best(candidates, query_vector, vectors) or (max(candidates, key=lambda s: s.popularity) if candidates else None)
        else: primary = self._semantic_best(stories, query_vector, vectors) or self._lexical_best(stories, normalized)
        if not primary: return self._empty(query, normalized, started)
        seed = vectors.get(primary.id, query_vector)
        if seed is not None and query_vector is not None: seed = .7 * seed + .3 * query_vector
        recommendations = self._recommend(stories, primary, seed, k, excluded, warnings)
        return SearchResult(query, normalized, intent, primary, recommendations, degraded, (perf_counter()-started)*1000)
    def _semantic_best(self, stories, vector, vectors):
        if vector is None: return None
        return max(stories, default=None, key=lambda s: (float(vector @ vectors.get(s.id, vector)), s.popularity))
    def _lexical_best(self, stories, query):
        return max(stories, key=lambda s: (sum(token in normalize(embedding_text(s)) for token in query.split()), s.popularity), default=None)
    def _recommend(self, stories, primary, seed, k, excluded, warnings):
        candidates = [s for s in stories if s.id != primary.id and s.id not in excluded and not (warnings & {normalize(w) for w in s.content_warnings})]
        vectors = self.index.vectors if self.index else {}
        rows = []
        for story in candidates:
            cosine = float(seed @ vectors[story.id]) if seed is not None and story.id in vectors else 0.0
            sg = sorted(set(primary.genres) & set(story.genres)); st = sorted(set(primary.tags) & set(story.tags))
            score = self.config.semantic_weight*cosine + self.config.genre_weight*jaccard(primary.genres, story.genres) + self.config.tag_weight*jaccard(primary.tags, story.tags)
            if score >= self.config.min_score: rows.append(Recommendation(story, score, sg, st, reason(sg, st)))
        selected, per_author = [], {}
        for item in sorted(rows, key=lambda r: (r.score, r.story.popularity), reverse=True):
            if per_author.get(item.story.author_id, 0) < 2:
                selected.append(item); per_author[item.story.author_id] = per_author.get(item.story.author_id, 0)+1
            if len(selected) >= k: break
        return selected
    def similar_to(self, story_id: int, k: int = 8) -> list[Recommendation]:
        story = self.repository.get_story(story_id)
        if not story or story.status != "published": return []
        return self._recommend(self._published(), story, self.index.vectors.get(story_id) if self.index else None, k, set(), set())
    def explain(self, result: SearchResult, top_n: int = 3) -> dict[int, str]:
        if not self.why_generator or not result.primary: return {}
        output = {}
        for rec in result.recommendations[:top_n]:
            context = public_story_context(result.primary, rec.story)
            output[rec.story.id] = self.why_generator.generate(result.normalized_query, rec.story.id, self._hashes.get(rec.story.id, ""), context, rec.reasons)
        return output
