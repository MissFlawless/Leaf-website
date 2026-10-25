"""Public value objects."""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass(frozen=True)
class Story:
    id: int
    title: str
    synopsis: str | None = ""
    genres: list[str] = field(default_factory=list)
    tags: list[str] = field(default_factory=list)
    content_warnings: list[str] = field(default_factory=list)
    author_id: int = 0
    author_name: str = ""
    status: str = "published"
    cover_url: Optional[str] = None
    popularity: int = 0
    updated_at: Optional[datetime] = None


@dataclass(frozen=True)
class Recommendation:
    story: Story
    score: float
    shared_genres: list[str]
    shared_tags: list[str]
    reasons: str


@dataclass(frozen=True)
class SearchResult:
    query: str
    normalized_query: str
    intent: str | None
    primary: Optional[Story]
    recommendations: list[Recommendation]
    degraded: bool
    latency_ms: float
