"""Configuration for the Story Metadata Agent.

All secrets come from environment variables; the .env file in the project
root (or backend/) is loaded by Flask before this module is imported.
Nothing secret is ever hard-coded here.
"""
import os
from dataclasses import dataclass, field
from pathlib import Path

# Auto-load .env so metadata_agent is 100% self-contained in any process
try:
    from dotenv import load_dotenv
    for _p in [
        Path(__file__).resolve().parents[1] / ".env",
        Path(__file__).resolve().parents[1] / "backend" / ".env",
    ]:
        if _p.exists():
            load_dotenv(_p, override=False)
except ImportError:
    pass

# ── Leaf taxonomy (single source of truth) ───────────────────────────────────
LEAF_GENRES: list[str] = [
    "Fantasy",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Historical",
    "Contemporary",
    "Adventure",
    "Horror",
]

LEAF_WARNINGS: list[str] = [
    "Violence",
    "Grief",
    "Strong language",
    "Mature themes",
    "Death",
    "Substance use",
]

# Default Gemini OpenAI-compatible base URL (same as recommendation_agent)
GEMINI_OPENAI_COMPATIBLE_BASE_URL = (
    "https://generativelanguage.googleapis.com/v1beta/openai/"
)

# Maximum number of words sent to the LLM to avoid token overflow
MAX_WORDS_SENT_TO_LLM: int = 3_500


def _get_api_key() -> str:
    """Read API key from env only when a request is about to be made.

    Prefers the dedicated METADATA_LLM_API_KEY; falls back to the key already
    configured for the recommendation agent so operators don't need to set a
    second variable.
    """
    return (
        os.getenv("METADATA_LLM_API_KEY")
        or os.getenv("RECOMMENDATION_LLM_API_KEY")
        or ""
    )


@dataclass(frozen=True)
class AgentConfig:
    """Immutable runtime configuration for StoryMetadataAgent."""

    # LLM provider: "openai_compatible" | "openai" | "anthropic"
    provider: str = field(
        default_factory=lambda: os.getenv(
            "METADATA_LLM_PROVIDER",
            os.getenv("RECOMMENDATION_LLM_PROVIDER", "openai_compatible"),
        )
    )

    # Model identifier, e.g. "gemini-2.0-flash"
    model: str = field(
        default_factory=lambda: os.getenv(
            "METADATA_LLM_MODEL",
            os.getenv("RECOMMENDATION_LLM_MODEL", ""),
        )
    )

    # OpenAI-compatible base URL
    base_url: str = field(
        default_factory=lambda: os.getenv(
            "METADATA_LLM_BASE_URL",
            os.getenv(
                "RECOMMENDATION_LLM_BASE_URL", GEMINI_OPENAI_COMPATIBLE_BASE_URL
            ),
        )
    )

    # HTTP timeout in seconds (dynamic lookup)
    timeout: float = field(
        default_factory=lambda: float(os.getenv("METADATA_LLM_TIMEOUT", "30.0"))
    )

    # Leaf taxonomy (can be overridden in tests)
    genres: tuple[str, ...] = field(default_factory=lambda: tuple(LEAF_GENRES))
    warnings: tuple[str, ...] = field(default_factory=lambda: tuple(LEAF_WARNINGS))
    max_words: int = MAX_WORDS_SENT_TO_LLM

    def api_key(self) -> str:
        return _get_api_key()
