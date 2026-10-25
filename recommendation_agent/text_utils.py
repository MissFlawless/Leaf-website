"""Safe and predictable text normalisation."""
import re
import unicodedata


def normalize(text: str | None) -> str:
    """Lowercase, remove accents/hash markers, and collapse whitespace."""
    raw = (text or "").strip().lower().replace("#", "")
    raw = "".join(char for char in unicodedata.normalize("NFD", raw) if unicodedata.category(char) != "Mn")
    return re.sub(r"\s+", " ", raw).strip()


def embedding_text(story) -> str:
    return f"{story.title} : {story.synopsis or ''}. Genres: {', '.join(story.genres or [])}. Tags: {', '.join(story.tags or [])}."
