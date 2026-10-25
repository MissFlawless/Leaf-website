"""Data models and enums for the Moderation Agent."""
from __future__ import annotations

from dataclasses import asdict, dataclass, field
from enum import Enum
from typing import Any, List, Optional


class ModerationStatus(str, Enum):
    APPROVED = "approved"
    FLAGGED = "flagged"
    NEEDS_REVIEW = "needs_review"


class ModerationCategory(str, Enum):
    TOXICITY = "toxicity"
    HARASSMENT = "harassment"
    SPAM = "spam"
    EXPLICIT = "explicit"
    INAPPROPRIATE = "inappropriate"
    OTHER = "other"


@dataclass
class ModerationResult:
    status: str  # "approved", "flagged", or "needs_review"
    categories: List[str] = field(default_factory=list)
    confidence: float = 1.0
    reason: str = ""
    flagged_terms: List[str] = field(default_factory=list)
    source: str = "rules"  # "rules", "llm", or "fallback"
    details: dict[str, Any] = field(default_factory=dict)

    @property
    def is_approved(self) -> bool:
        return self.status == ModerationStatus.APPROVED.value

    @property
    def is_flagged(self) -> bool:
        return self.status == ModerationStatus.FLAGGED.value

    @property
    def requires_review(self) -> bool:
        return self.status == ModerationStatus.NEEDS_REVIEW.value

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)
