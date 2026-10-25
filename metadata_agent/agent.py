"""Core orchestrator for the Story Metadata Agent.

Responsibilities
----------------
1. Sanitise and truncate raw chapter HTML into safe plain text.
2. Build the prompt (inject chapter text as data, not instructions).
3. Call the LLM provider.
4. Validate and filter the response against the Leaf taxonomy.
5. Return a ChapterMetadataOutput — with a rule-based fallback if the LLM
   fails so the feature degrades gracefully rather than crashing.

Nothing in this module imports Flask, SQLAlchemy or any web framework, keeping
the agent independently testable.
"""
import re
from time import perf_counter
from typing import Optional

from .config import AgentConfig
from .models import ChapterAnalysisInput, ChapterMetadataOutput
from .prompts import PROMPT_VERSION, build_user_prompt
from .provider import MetadataLLMProvider


# ---------------------------------------------------------------------------
# Text sanitisation helpers
# ---------------------------------------------------------------------------

_TAG_RE = re.compile(r"<[^>]+>")
_WHITESPACE_RE = re.compile(r"\s+")


def _strip_html(html: str) -> str:
    """Remove HTML tags and normalise whitespace.

    Uses a simple regex approach (same strategy as the recommendation_agent's
    word_count helper in chapters.py). We do NOT import Bleach here to keep the
    package dependency-free; Bleach is used in the Flask layer before storing
    content in the database.
    """
    text = _TAG_RE.sub(" ", html or "")
    return _WHITESPACE_RE.sub(" ", text).strip()


def _truncate_to_words(text: str, max_words: int) -> str:
    """Return at most `max_words` words from `text`."""
    words = text.split()
    if len(words) <= max_words:
        return text
    truncated = " ".join(words[:max_words])
    return truncated + " [… truncated for analysis]"


# ---------------------------------------------------------------------------
# Taxonomy filtering helpers
# ---------------------------------------------------------------------------

def _filter_by_taxonomy(values: list, allowed: tuple[str, ...]) -> list[str]:
    """Keep only values that appear in the allowed taxonomy (case-sensitive)."""
    allowed_set = set(allowed)
    return [v for v in values if isinstance(v, str) and v in allowed_set]


def _clean_tags(raw_tags: list) -> list[str]:
    """Lowercase, strip # prefixes and remove duplicates while preserving order."""
    seen: set[str] = set()
    cleaned: list[str] = []
    for t in raw_tags:
        if not isinstance(t, str):
            continue
        tag = t.lstrip("#").strip().lower()
        if tag and tag not in seen:
            seen.add(tag)
            cleaned.append(tag)
    return cleaned[:6]  # cap at 6


# ---------------------------------------------------------------------------
# Rule-based fallback
# ---------------------------------------------------------------------------

def _build_fallback(inp: ChapterAnalysisInput, error: Optional[str]) -> ChapterMetadataOutput:
    """Return a minimal, safe result when the LLM is unavailable.

    The blurb is templated from the story/chapter titles so the field is never
    empty even without an LLM.
    """
    story = inp.story_title or "this story"
    chapter = inp.chapter_title or f"chapter {inp.chapter_position}"
    blurb = (
        f"{story} continues in {chapter}. "
        "Dive in to discover where the story leads."
    )
    return ChapterMetadataOutput(
        blurb=blurb,
        genres=list(inp.existing_genres) if inp.existing_genres else [],
        tags=[],
        content_warnings=[],
        reasoning_summary="(fallback – LLM unavailable)",
        prompt_version=PROMPT_VERSION,
        latency_ms=0.0,
        fallback_used=True,
        error=error,
    )


# ---------------------------------------------------------------------------
# Main agent class
# ---------------------------------------------------------------------------

class StoryMetadataAgent:
    """Analyses a chapter and generates editorial metadata for the Leaf platform.

    Parameters
    ----------
    config : AgentConfig
        Runtime configuration (model, API key location, timeouts, taxonomy).
    _provider : MetadataLLMProvider | None
        Injected provider for testing. If None, one is created from `config`.

    Usage
    -----
    >>> from metadata_agent import StoryMetadataAgent, AgentConfig
    >>> agent = StoryMetadataAgent(AgentConfig())
    >>> result = agent.analyse(ChapterAnalysisInput(chapter_html="<p>…</p>"))
    >>> print(result.blurb)
    """

    def __init__(
        self,
        config: Optional[AgentConfig] = None,
        _provider: Optional[MetadataLLMProvider] = None,
    ):
        self.config = config or AgentConfig()
        self.provider = _provider or MetadataLLMProvider(self.config)

    # ── Public API ────────────────────────────────────────────────────────────

    def analyse(self, inp: ChapterAnalysisInput) -> ChapterMetadataOutput:
        """Run the full metadata extraction pipeline.

        Steps
        -----
        1. Sanitise HTML → plain text.
        2. Truncate to max_words to avoid token overflow.
        3. Build the prompt (user turn only; system prompt is sent separately).
        4. Call the LLM via the provider.
        5. Parse and validate the response.
        6. Filter genres and warnings against the Leaf taxonomy.
        7. Return ChapterMetadataOutput (or a fallback on failure).
        """
        # Step 1 & 2 – sanitise and truncate
        plain_text = _strip_html(inp.chapter_html)
        plain_text = _truncate_to_words(plain_text, self.config.max_words)

        if not plain_text:
            return _build_fallback(inp, "empty_chapter_text")

        # Step 3 – build prompt
        user_prompt = build_user_prompt(
            story_title=inp.story_title,
            chapter_title=inp.chapter_title,
            chapter_position=inp.chapter_position,
            existing_genres=inp.existing_genres,
            chapter_text=plain_text,
        )

        # Step 4 – call LLM
        started = perf_counter()
        raw = self.provider.generate(user_prompt)
        latency_ms = (perf_counter() - started) * 1000

        if raw is None:
            return _build_fallback(inp, self.provider.last_error)

        # Step 5 – parse response
        parsed = self.provider.parse_response(raw)
        if parsed is None:
            return _build_fallback(inp, "invalid_json_response")

        # Step 6 – filter against Leaf taxonomy
        genres = _filter_by_taxonomy(parsed.get("genres", []), self.config.genres)
        warnings = _filter_by_taxonomy(
            parsed.get("content_warnings", []), self.config.warnings
        )
        tags = _clean_tags(parsed.get("tags", []))
        blurb = (parsed.get("blurb") or "").strip()
        if not blurb:
            return _build_fallback(inp, "empty_blurb")

        # Step 7 – build result
        return ChapterMetadataOutput(
            blurb=blurb,
            genres=genres,
            tags=tags,
            content_warnings=warnings,
            reasoning_summary=(parsed.get("reasoning_summary") or "")[:500],
            prompt_version=PROMPT_VERSION,
            latency_ms=latency_ms + self.provider.last_latency_ms,
            fallback_used=False,
            error=None,
        )
