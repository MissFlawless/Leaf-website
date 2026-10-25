"""Safe, lazy explanation providers with API-first fallback."""
from functools import lru_cache
import json
import os
import re
from .config import GEMINI_OPENAI_COMPATIBLE_BASE_URL, get_llm_api_key
from .prompts import SYSTEM_PROMPT, build_why_prompt


class ApiProvider:
    """Small API provider which never lets remote failures escape to callers."""
    def __init__(self, provider=None, model=None, api_key=None, base_url=None, client=None):
        self.provider = provider or os.getenv("RECOMMENDATION_LLM_PROVIDER", "").lower()
        self.model = model or os.getenv("RECOMMENDATION_LLM_MODEL", "")
        self.base_url = base_url or os.getenv("RECOMMENDATION_LLM_BASE_URL", GEMINI_OPENAI_COMPATIBLE_BASE_URL)
        self._api_key_override = api_key
        self.client = client
        self.last_error = None

    def __repr__(self):
        return f"ApiProvider(provider={self.provider!r}, model={self.model!r}, base_url={self.base_url!r})"

    def _api_key(self):
        return self._api_key_override if self._api_key_override is not None else get_llm_api_key()

    def _openai_compatible(self, prompt, api_key):
        import httpx

        url = self.base_url.rstrip("/") + "/chat/completions"
        client = self.client or httpx.Client(timeout=5.0)
        response = client.post(
            url,
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "model": self.model,
                "temperature": 0.2,
                "max_tokens": 80,
                "response_format": {"type": "json_object"},
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
            },
        )
        status = getattr(response, "status_code", 200)
        if status in {400, 401, 403}:
            self.last_error = "key_invalid_or_not_authorized"
            return None
        if status == 404:
            self.last_error = "wrong_model_or_base_url"
            return None
        if status == 429:
            self.last_error = "quota_reached"
            return None
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    def generate(self, prompt):
        self.last_error = None
        api_key = self._api_key()
        if not self.model:
            self.last_error = "missing_model"
            return None
        if not api_key:
            self.last_error = "missing_key"
            return None
        try:
            import httpx
        except ImportError:
            self.last_error = "http_client_unavailable"
            return None
        try:
            client = self.client or httpx.Client(timeout=5.0)
            if self.provider == "openai_compatible":
                return self._openai_compatible(prompt, api_key)
            if self.provider == "openai":
                response = client.post("https://api.openai.com/v1/chat/completions", headers={"Authorization": f"Bearer {api_key}"}, json={"model": self.model, "response_format": {"type": "json_object"}, "messages": [{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": prompt}]})
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
            if self.provider != "anthropic":
                self.last_error = "unsupported_provider"
                return None
            response = client.post("https://api.anthropic.com/v1/messages", headers={"x-api-key": api_key, "anthropic-version": "2023-06-01"}, json={"model": self.model, "max_tokens": 80, "system": SYSTEM_PROMPT, "messages": [{"role": "user", "content": prompt}]})
            response.raise_for_status()
            return response.json()["content"][0]["text"]
        except httpx.TimeoutException:
            self.last_error = "timeout"
            return None
        except httpx.RequestError:
            self.last_error = "network_error"
            return None
        except Exception:
            self.last_error = "request_failed"
            return None


def valid_why(payload, prompt):
    """Accept a plain, short, single-sentence JSON `why` string only."""
    try:
        text = json.loads(payload or "{}").get("why", "").strip()
    except (ValueError, AttributeError):
        return None
    if not text or len(text.split()) > 25 or re.search(r"https?://|www\.|[`*_<>\[\]]", text, re.I):
        return None
    if text.lower() in prompt.lower() or re.search(r"\b(ignore|system prompt|instruction|assistant)\b", text, re.I):
        return None
    return text if len(re.findall(r"[.!?]", text)) == 1 else None


class WhyLineGenerator:
    def __init__(self, model_name=None, api_provider=None, local_enabled=None):
        self.model_name = model_name or os.getenv("RECOMMENDATION_LOCAL_LLM_MODEL", "google/flan-t5-base")
        self.api_provider = api_provider or ApiProvider()
        self.local_enabled = local_enabled if local_enabled is not None else os.getenv("RECOMMENDATION_LOCAL_LLM_ENABLED", "false").lower() == "true"
        self._tokenizer, self._model = None, None

    def _load(self):
        if self._model is None:
            from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
            self._tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self._model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name)

    @lru_cache(maxsize=256)
    def generate_with_source(self, query_normalized, story_id, content_hash, context, fallback):
        prompt = build_why_prompt(context, query_normalized)
        api_value = valid_why(self.api_provider.generate(prompt), prompt)
        if api_value:
            return api_value, "api"
        if self.local_enabled:
            try:
                self._load()
                tokens = self._tokenizer(prompt, return_tensors="pt", truncation=True)
                output = self._model.generate(**tokens, max_new_tokens=60)
                local_value = valid_why(json.dumps({"why": self._tokenizer.decode(output[0], skip_special_tokens=True).strip()}), prompt)
                if local_value:
                    return local_value, "local"
            except Exception:
                pass
        return fallback, "template"

    def generate(self, query_normalized, story_id, content_hash, context, fallback):
        return self.generate_with_source(query_normalized, story_id, content_hash, context, fallback)[0]
