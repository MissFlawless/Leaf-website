"""Typed value objects (data transfer objects) for the Story Metadata Agent.

These are plain, framework-independent dataclasses – no Flask, no SQLAlchemy.
They are the single source of truth for what goes IN and what comes OUT of the
agent, making testing and serialisation straightforward.
"""
from dataclasses import dataclass, field
from typing import Optional


@dataclass(frozen=True)
class ChapterAnalysisInput:
    """Everything the agent needs to perform an analysis.

    Attributes
    ----------
    chapter_html : str
        Raw HTML content of the chapter (as stored in Chapter.content).
    story_title : str
        Title of the parent story – used to give the LLM extra context.
    chapter_title : str
        Title of this specific chapter.
    chapter_position : int
        1-based position of the chapter in the story (1 = first chapter).
    existing_genres : list[str]
        Genres already assigned to the story, forwarded as context so the LLM
        can complement rather than duplicate them.
    existing_warnings : list[str]
        Warnings already on the story (same rationale).
    """

    chapter_html: str
    story_title: str = ""
    chapter_title: str = ""
    chapter_position: int = 1
    existing_genres: list[str] = field(default_factory=list)
    existing_warnings: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class ChapterMetadataOutput:
    """The structured result of a metadata analysis.

    All list fields are guaranteed to contain only values from the Leaf
    taxonomy; the agent filters any hallucinated values before returning.

    Attributes
    ----------
    blurb : str
        Editorial pitch (2-4 sentences, 60-90 words) suitable for display on
        the story card or the story detail page.
    genres : list[str]
        Suggested genres, subset of LEAF_GENRES.
    tags : list[str]
        3-6 thematic lowercase keywords, each without the # prefix (the
        frontend / backend adds it as needed).
    content_warnings : list[str]
        Subset of LEAF_WARNINGS that apply to this chapter.
    reasoning_summary : str
        Brief CoT summary produced by the LLM – kept for the PROMPTS_LOG
        report but NOT shown to end-users.
    prompt_version : str
        Version tag of the prompt template used (e.g. "meta-v3").
    latency_ms : float
        Wall-clock time of the LLM round-trip in milliseconds.
    fallback_used : bool
        True when the LLM call failed and a rule-based fallback was returned.
    error : Optional[str]
        Human-readable error code if something went wrong, else None.
    """

    blurb: str
    genres: list[str]
    tags: list[str]
    content_warnings: list[str]
    reasoning_summary: str = ""
    prompt_version: str = "meta-v3"
    latency_ms: float = 0.0
    fallback_used: bool = False
    error: Optional[str] = None

    def to_dict(self) -> dict:
        """Serialise to a plain dict for JSON API responses."""
        return {
            "blurb": self.blurb,
            "genres": self.genres,
            "tags": self.tags,
            "content_warnings": self.content_warnings,
            "reasoning_summary": self.reasoning_summary,
            "prompt_version": self.prompt_version,
            "latency_ms": round(self.latency_ms, 1),
            "fallback_used": self.fallback_used,
            "error": self.error,
        }
