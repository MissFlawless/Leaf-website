"""Rule-based pattern and heuristic moderation analyzer."""
from __future__ import annotations

import re
from typing import List, Tuple
from moderation_agent.models import ModerationCategory, ModerationResult, ModerationStatus


# Regex patterns for toxicity and targeted harassment (hard flag)
TOXIC_PATTERNS: List[Tuple[str, str]] = [
    (r"\b(kys|kill\s+your\s*self)\b", "Encouragement of self-harm or suicide"),
    (r"\b(i('ll|\s*will)\s+[\w\s]{0,25}?(kill|murder|hunt|shoot|stab)\s+you)\b", "Violent threat against an individual"),
    (r"\b(kill|murder|hunt\s+down|shoot|stab)\s+you\b", "Violent threat against an individual"),
    (r"\b(die\s+in\s+a\s+fire|you\s+should\s+die)\b", "Severe hostility wishing harm or death"),
    (r"\b(subhuman|fag(got)?|nigg[ae]r?|retard(ed)?|kike|tranny)\b", "Hate speech or discriminatory slur"),
    (r"\b(piece\s+of\s+shit|scum\s+of\s+the\s+earth|burn\s+in\s+hell)\b", "Severe targeted harassment"),
]

# Regex patterns for spam (hard flag)
SPAM_PATTERNS: List[Tuple[str, str]] = [
    (r"\b(free\s+crypto|crypto\s+giveaway|airdrop\s+token|earn\s+\$?\d+[\d,]*\s*(daily|a\s+day|per\s+day))\b", "Cryptocurrency or financial scam promotion"),
    (r"\b(buy\s+(cheap\s+)?(followers|likes|views|subscribers))\b", "Social media metrics manipulation spam"),
    (r"\b(whatsapp|telegram|dm\s+me\s+at)\s*[:\-\s]*\+?\d{8,}\b", "Unsolicited messaging / contact solicitation spam"),
    (r"(https?://\S*(bit\.ly|tinyurl\.com|t\.me|wa\.me|t\.co/\S+|free-bonus|claim-rewards)\S*)", "Suspicious or shortened promotional link"),
    (r"\b(click\s+here\s+to\s+(win|claim|get\s+free))\b", "Clickbait or phishing solicitation"),
    (r"(.)\1{12,}", "Repetitive character gibberish"),
]

# Regex patterns for explicit / NSFW content
EXPLICIT_PATTERNS: List[Tuple[str, str]] = [
    (r"\b(hardcore\s+porn|child\s*porn|cp\s+links|incest\s+video|bestiality)\b", "Unlawful or extreme explicit content"),
    (r"\b(cumshot|gangbang|blowjob\s+video|pornographic)\b", "Explicit adult content"),
]

# Regex patterns for borderline cases requiring human review
BORDERLINE_PATTERNS: List[Tuple[str, str]] = [
    (r"\b(idiot|stupid|moron|dumb|trash|garbage|clown)\b", "Mildly hostile insult requiring review"),
    (r"\b(delete\s+(this|your)\s+(story|chapter|account)|stop\s+writing)\b", "Discouraging or hostile critique requiring review"),
    (r"\b(wtf|fuck\s+(you|off)|shit\s+story|crap)\b", "Profanity in user comment requiring review"),
    (r"\b(depressed|feel\s+like\s+giving\s+up|want\s+to\s+disappear|cannot\s+go\s+on)\b", "Distress or borderline self-harm mention requiring review"),
]


def strip_html(text: str) -> str:
    """Remove HTML tags for chapter text analysis."""
    if not text:
        return ""
    clean = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", clean).strip()


def check_rules(text: str, is_chapter: bool = False) -> ModerationResult:
    """Analyze text using fast deterministic pattern matching."""
    normalized = strip_html(text)
    if not normalized:
        return ModerationResult(
            status=ModerationStatus.APPROVED.value,
            categories=[],
            confidence=1.0,
            reason="Empty or whitespace-only content",
            source="rules",
        )

    matched_categories: List[str] = []
    reasons: List[str] = []
    flagged_terms: List[str] = []

    # 1. Toxicity check
    for pattern, desc in TOXIC_PATTERNS:
        match = re.search(pattern, normalized, re.IGNORECASE)
        if match:
            matched_categories.append(ModerationCategory.TOXICITY.value)
            matched_categories.append(ModerationCategory.HARASSMENT.value)
            reasons.append(desc)
            flagged_terms.append(match.group(0))

    # 2. Spam check
    for pattern, desc in SPAM_PATTERNS:
        match = re.search(pattern, normalized, re.IGNORECASE)
        if match:
            matched_categories.append(ModerationCategory.SPAM.value)
            reasons.append(desc)
            flagged_terms.append(match.group(0))

    # 3. Explicit check
    for pattern, desc in EXPLICIT_PATTERNS:
        match = re.search(pattern, normalized, re.IGNORECASE)
        if match:
            matched_categories.append(ModerationCategory.EXPLICIT.value)
            reasons.append(desc)
            flagged_terms.append(match.group(0))

    # Deduplicate categories
    matched_categories = list(dict.fromkeys(matched_categories))

    # If any hard violation is triggered, classify as FLAGGED
    if matched_categories:
        return ModerationResult(
            status=ModerationStatus.FLAGGED.value,
            categories=matched_categories,
            confidence=0.95,
            reason="; ".join(reasons),
            flagged_terms=flagged_terms,
            source="rules",
        )

    # 4. Borderline check -> NEEDS_REVIEW
    borderline_reasons: List[str] = []
    borderline_terms: List[str] = []
    for pattern, desc in BORDERLINE_PATTERNS:
        match = re.search(pattern, normalized, re.IGNORECASE)
        if match:
            borderline_reasons.append(desc)
            borderline_terms.append(match.group(0))

    if borderline_reasons:
        return ModerationResult(
            status=ModerationStatus.NEEDS_REVIEW.value,
            categories=[ModerationCategory.INAPPROPRIATE.value],
            confidence=0.75,
            reason="; ".join(borderline_reasons),
            flagged_terms=borderline_terms,
            source="rules",
        )

    # Clean content
    return ModerationResult(
        status=ModerationStatus.APPROVED.value,
        categories=[],
        confidence=1.0,
        reason="Content complies with community guidelines",
        source="rules",
    )
