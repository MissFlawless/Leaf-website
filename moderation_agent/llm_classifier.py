"""Optional LLM-based classifier for nuanced moderation decisions."""
from __future__ import annotations

import json
import logging
import urllib.request
import urllib.error
from typing import Optional

from moderation_agent.config import ModerationConfig, get_moderation_llm_api_key
from moderation_agent.models import ModerationResult, ModerationStatus

log = logging.getLogger(__name__)


SYSTEM_PROMPT = """You are an automated content moderation assistant for Leaf, a creative writing platform.
Your task is to analyze user comments or chapter submissions for:
1. toxicity and hate speech
2. harassment and personal attacks
3. unsolicited spam or advertising
4. illegal, non-consensual, or extreme explicit content
5. inappropriate or disruptive content

Classify the text into one of three statuses:
- "approved": Content is safe, creative, or standard critique.
- "flagged": Content severely violates community standards (hate speech, severe toxicity, threats, illegal/extreme explicit content, overt spam).
- "needs_review": Content is borderline, ambiguous, heated criticism, or sensitive themes that need human moderator inspection.

You MUST respond strictly with a valid JSON object matching this schema:
{
  "status": "approved" | "flagged" | "needs_review",
  "categories": ["toxicity" | "harassment" | "spam" | "explicit" | "inappropriate"],
  "confidence": float between 0.0 and 1.0,
  "reason": "short explanation of the decision"
}
Do not include markdown code fences or additional commentary.
"""


class LLMModerationClassifier:
    def __init__(self, config: Optional[ModerationConfig] = None):
        self.config = config or ModerationConfig()

    def is_available(self) -> bool:
        return bool(get_moderation_llm_api_key() and self.config.llm_model)

    def classify(self, text: str, content_type: str = "comment") -> Optional[ModerationResult]:
        """Classify text using the configured LLM endpoint.
        Returns ModerationResult if successful, or None on failure to trigger fallback.
        """
        api_key = get_moderation_llm_api_key()
        if not api_key or not self.config.llm_model:
            return None

        # Build endpoint URL (OpenAI-compatible)
        base_url = self.config.llm_base_url.rstrip("/")
        endpoint = f"{base_url}/chat/completions"

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        }

        payload = {
            "model": self.config.llm_model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Type: {content_type}\nText: {text[:2000]}"},
            ],
            "temperature": 0.0,
            "response_format": {"type": "json_object"} if "openai" in base_url or "generativelanguage" in base_url else None,
        }
        # Filter None values
        payload = {k: v for k, v in payload.items() if v is not None}

        try:
            req = urllib.request.Request(
                endpoint,
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=self.config.timeout_seconds) as response:
                body = response.read().decode("utf-8")
                data = json.loads(body)
                choices = data.get("choices", [])
                if not choices:
                    log.warning("LLM moderation response contained no choices.")
                    return None

                raw_content = choices[0].get("message", {}).get("content", "").strip()
                # Clean possible markdown fences
                if raw_content.startswith("```"):
                    raw_content = raw_content.strip("`").lstrip("json").strip()

                parsed = json.loads(raw_content)
                status = parsed.get("status", ModerationStatus.APPROVED.value)
                if status not in {"approved", "flagged", "needs_review"}:
                    status = ModerationStatus.APPROVED.value

                return ModerationResult(
                    status=status,
                    categories=parsed.get("categories", []),
                    confidence=float(parsed.get("confidence", 0.9)),
                    reason=parsed.get("reason", "Decision by LLM classifier"),
                    source="llm",
                    details=parsed,
                )
        except Exception as e:
            log.warning("LLM moderation classifier request failed (%s); falling back to rules.", e)
            return None
