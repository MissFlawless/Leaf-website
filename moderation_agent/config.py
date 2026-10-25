"""Configuration for the Moderation Agent."""
from dataclasses import dataclass
import os


GEMINI_OPENAI_COMPATIBLE_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"


def get_moderation_llm_api_key() -> str:
    """Read moderation API key at request time to support runtime environment changes."""
    return os.getenv("MODERATION_LLM_API_KEY", "")


@dataclass(frozen=True)
class ModerationConfig:
    llm_model: str = os.getenv("MODERATION_LLM_MODEL", "")
    llm_provider: str = os.getenv("MODERATION_LLM_PROVIDER", "")
    llm_base_url: str = os.getenv("MODERATION_LLM_BASE_URL", GEMINI_OPENAI_COMPATIBLE_BASE_URL)
    local_enabled: bool = os.getenv("MODERATION_LOCAL_ENABLED", "true").lower() == "true"
    strict_mode: bool = os.getenv("MODERATION_STRICT_MODE", "false").lower() == "true"
    timeout_seconds: float = float(os.getenv("MODERATION_TIMEOUT_SECONDS", "5.0"))
