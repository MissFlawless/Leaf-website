"""Main Moderation Agent combining deterministic rules with optional LLM refinement."""
from __future__ import annotations

import logging
from typing import Optional

from moderation_agent.config import ModerationConfig
from moderation_agent.llm_classifier import LLMModerationClassifier
from moderation_agent.models import ModerationResult, ModerationStatus
from moderation_agent.rules import check_rules

log = logging.getLogger(__name__)


class ModerationAgent:
    """Modular agent for checking comments and chapters for toxicity, spam, and inappropriate content."""

    def __init__(
        self,
        config: Optional[ModerationConfig] = None,
        classifier: Optional[LLMModerationClassifier] = None,
    ):
        self.config = config or ModerationConfig()
        self.classifier = classifier or LLMModerationClassifier(self.config)

    def check_text(self, text: str, content_type: str = "text") -> ModerationResult:
        """Inspect plain or HTML text."""
        # 1. Fast deterministic rule pass
        rule_result = check_rules(text)

        # Severe hard violations are flagged immediately for safety and speed
        if rule_result.is_flagged:
            return rule_result

        # 2. If an LLM is available and configured, consult it for nuanced classification
        if self.classifier.is_available():
            try:
                llm_result = self.classifier.classify(text, content_type=content_type)
            except Exception as e:
                log.warning("Classifier call failed: %s", e)
                llm_result = None

            if llm_result is not None:
                # If LLM classified as flagged or needs review, trust it
                if llm_result.is_flagged or llm_result.requires_review:
                    return llm_result
                # If rule considered it borderline but LLM considered it approved,
                # respect strict mode or return rule result
                if rule_result.requires_review and self.config.strict_mode:
                    return rule_result
                return llm_result
            # LLM provider failure: fall back cleanly to rule result
            rule_result.source = "fallback"

        # 3. Return rule result (approved or needs_review)
        return rule_result

    def check_comment(self, body: str, context: Optional[dict] = None) -> ModerationResult:
        """Inspect a user comment for community guideline violations."""
        return self.check_text(body, content_type="comment")

    def check_chapter(self, title: str, content: str, context: Optional[dict] = None) -> ModerationResult:
        """Inspect chapter title and content for community guideline violations."""
        combined = f"{title}\n\n{content}"
        return self.check_text(combined, content_type="chapter")
