"""Hybrid rank calculations and result diversity."""
from .text_utils import normalize


def jaccard(left, right) -> float:
    a, b = {normalize(v) for v in left or []}, {normalize(v) for v in right or []}
    return len(a & b) / len(a | b) if a or b else 0.0


def reason(shared_genres, shared_tags) -> str:
    parts = []
    if shared_genres: parts.append("Same genres: " + ", ".join(shared_genres))
    if shared_tags: parts.append("Shared tags: " + ", ".join("#" + t.lstrip("#") for t in shared_tags))
    return " · ".join(parts) or "A close match for your search."
