"""Dependency-free lexical intent and title matching."""
from difflib import SequenceMatcher
from .text_utils import normalize


def find_title(query: str, stories):
    q = normalize(query)
    exact = [s for s in stories if normalize(s.title) == q]
    if exact:
        return exact[0]
    prefix = [s for s in stories if normalize(s.title).startswith(q)]
    if prefix:
        return max(prefix, key=lambda s: s.popularity)
    matches = [(SequenceMatcher(None, q, normalize(s.title)).ratio(), s) for s in stories]
    return max(matches, default=(0, None), key=lambda item: (item[0], item[1].popularity if item[1] else 0))[1] if matches and max(matches, key=lambda x: x[0])[0] >= .8 else None


def detect_intent(query: str, stories) -> tuple[str, object | None]:
    title = find_title(query, stories)
    if title:
        return "TITLE", title
    q = normalize(query)
    genres = {normalize(g) for story in stories for g in story.genres}
    tags = {normalize(t) for story in stories for t in story.tags}
    if any(g and g in q for g in genres):
        return "GENRE", next(g for g in genres if g and g in q)
    if query.strip().startswith("#") or q in tags:
        return "TAG", q
    return "DESCRIPTION", None
