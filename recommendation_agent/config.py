"""Configuration for recommendation ranking and optional models."""
from dataclasses import dataclass
import os


GEMINI_OPENAI_COMPATIBLE_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"


def get_llm_api_key() -> str:
    """Read the API key only when an LLM request is about to be made."""
    return os.getenv("RECOMMENDATION_LLM_API_KEY", "")


@dataclass(frozen=True)
class RankingConfig:
    semantic_weight: float = float(os.getenv("RECOMMENDATION_SEMANTIC_WEIGHT", "0.6"))
    genre_weight: float = float(os.getenv("RECOMMENDATION_GENRE_WEIGHT", "0.25"))
    tag_weight: float = float(os.getenv("RECOMMENDATION_TAG_WEIGHT", "0.15"))
    min_score: float = float(os.getenv("RECOMMENDATION_MIN_SCORE", "0.0"))
    max_recommendations_per_author: int = int(os.getenv("RECOMMENDATION_MAX_PER_AUTHOR", "5"))
    embedding_model: str = os.getenv("RECOMMENDATION_EMBEDDING_MODEL", "paraphrase-multilingual-MiniLM-L12-v2")
    llm_model: str = os.getenv("RECOMMENDATION_LLM_MODEL", "")
    llm_provider: str = os.getenv("RECOMMENDATION_LLM_PROVIDER", "")
    llm_base_url: str = os.getenv("RECOMMENDATION_LLM_BASE_URL", GEMINI_OPENAI_COMPATIBLE_BASE_URL)
    local_llm_enabled: bool = os.getenv("RECOMMENDATION_LOCAL_LLM_ENABLED", "false").lower() == "true"
