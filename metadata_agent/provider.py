"""LLM provider client for the Story Metadata Agent.

Mirrors the ApiProvider pattern in recommendation_agent/explain.py but is
tuned for structured JSON extraction (higher max_tokens, strict JSON mode).

Error handling contract
-----------------------
- generate() ALWAYS returns either a raw JSON string or None.
- Exceptions from the HTTP layer are caught; callers never see them.
- self.last_error is set to a short error-code string for observability.
- No secret values (API keys, tokens) are ever logged or included in errors.
"""
import json
import os
from time import perf_counter
from typing import Optional

from .config import AgentConfig
from .prompts import SYSTEM_PROMPT

# HTTP status codes that should not be retried
_TERMINAL_STATUSES = {400, 401, 403, 404}


class MetadataLLMProvider:
    """Thin, resilient HTTP client for OpenAI-compatible LLM endpoints.

    Parameters
    ----------
    config : AgentConfig
        Runtime configuration (model, base_url, timeout, …).
    _client : optional
        Inject a custom httpx.Client for testing (avoids real HTTP calls).
    """

    def __init__(self, config: AgentConfig, _client=None):
        self.config = config
        self._injected_client = _client
        self.last_error: Optional[str] = None
        self.last_latency_ms: float = 0.0

    # ── Public API ────────────────────────────────────────────────────────────

    def generate(self, user_prompt: str) -> Optional[str]:
        """Send a request to the LLM and return the raw response string.

        Returns None (and sets self.last_error) on any failure so callers can
        implement a graceful fallback without try/except boilerplate.
        """
        self.last_error = None
        self.last_latency_ms = 0.0

        # Guard: require model and API key before making any network call
        if not self.config.model:
            self.last_error = "missing_model"
            return None

        api_key = self.config.api_key()
        if not api_key:
            self.last_error = "missing_api_key"
            return None

        try:
            import httpx
        except ImportError:
            self.last_error = "httpx_not_installed"
            return None

        provider = self.config.provider.lower()
        started = perf_counter()

        try:
            if provider == "openai_compatible":
                raw = self._call_openai_compatible(user_prompt, api_key)
            elif provider == "openai":
                raw = self._call_openai(user_prompt, api_key)
            elif provider == "anthropic":
                raw = self._call_anthropic(user_prompt, api_key)
            else:
                self.last_error = "unsupported_provider"
                return None
        except Exception as exc:
            # Catch all network / timeout errors; never propagate
            error_type = type(exc).__name__
            # Map common httpx exception names to short codes without importing
            if "Timeout" in error_type:
                self.last_error = "timeout"
            elif "RequestError" in error_type or "ConnectError" in error_type:
                self.last_error = "network_error"
            else:
                self.last_error = "request_failed"
            return None
        finally:
            self.last_latency_ms = (perf_counter() - started) * 1000

        return raw

    # ── Private helpers ───────────────────────────────────────────────────────

    def _client(self):
        """Return the injected test client or a real httpx.Client."""
        if self._injected_client is not None:
            return self._injected_client
        import httpx
        return httpx.Client(timeout=self.config.timeout)

    def _handle_status(self, status_code: int) -> Optional[str]:
        """Return an error code string for non-OK status codes, else None."""
        if status_code in {400, 401, 403}:
            return "key_invalid_or_not_authorized"
        if status_code == 404:
            return "wrong_model_or_base_url"
        if status_code == 429:
            return "quota_exceeded"
        if status_code >= 500:
            return "server_error"
        return None

    def _call_openai_compatible(self, user_prompt: str, api_key: str) -> Optional[str]:
        import httpx

        url = self.config.base_url.rstrip("/") + "/chat/completions"
        payload = {
            "model": self.config.model,
            "temperature": 0.2,
            "max_tokens": 512,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
        }
        client = self._client()
        response = client.post(
            url,
            headers={"Authorization": f"Bearer {api_key}"},
            json=payload,
        )
        err = self._handle_status(response.status_code)
        if err:
            self.last_error = err
            return None
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    def _call_openai(self, user_prompt: str, api_key: str) -> Optional[str]:
        payload = {
            "model": self.config.model,
            "temperature": 0.2,
            "max_tokens": 512,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
        }
        client = self._client()
        response = client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json=payload,
        )
        err = self._handle_status(response.status_code)
        if err:
            self.last_error = err
            return None
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    def _call_anthropic(self, user_prompt: str, api_key: str) -> Optional[str]:
        payload = {
            "model": self.config.model,
            "max_tokens": 512,
            "system": SYSTEM_PROMPT,
            "messages": [{"role": "user", "content": user_prompt}],
        }
        client = self._client()
        response = client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
            },
            json=payload,
        )
        err = self._handle_status(response.status_code)
        if err:
            self.last_error = err
            return None
        response.raise_for_status()
        return response.json()["content"][0]["text"]

    # ── Response validation ───────────────────────────────────────────────────

    @staticmethod
    def parse_response(raw: Optional[str]) -> Optional[dict]:
        """Parse and lightly validate the raw LLM response string.

        Returns the parsed dict if the required keys are present and the values
        are of the correct type; returns None otherwise.
        """
        if not raw:
            return None
        try:
            data = json.loads(raw)
        except (json.JSONDecodeError, ValueError):
            return None

        # All four result keys must be present with the right types
        required = {
            "blurb": str,
            "genres": list,
            "tags": list,
            "content_warnings": list,
        }
        for key, expected_type in required.items():
            if key not in data or not isinstance(data[key], expected_type):
                return None

        # blurb must be a non-empty string
        if not data["blurb"].strip():
            return None

        return data
