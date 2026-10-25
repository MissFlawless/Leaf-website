"""Safely inspect the configured why-line LLM connection.

Run with ``python -m recommendation_agent.check_llm`` from the repository root.
"""
from pathlib import Path
import os
import time

from dotenv import load_dotenv

load_dotenv(Path(__file__).parents[1] / ".env", override=False)

from .config import GEMINI_OPENAI_COMPATIBLE_BASE_URL, get_llm_api_key
from .explain import ApiProvider, WhyLineGenerator


def _masked_key(key: str) -> str:
    if not key:
        return "not present"
    return "present (ends in " + key[-4:] + ")"


def _error_message(error: str | None) -> str:
    return {
        "missing_key": "API key is missing.",
        "key_invalid_or_not_authorized": "Key is invalid or not authorized (400/401/403).",
        "wrong_model_or_base_url": "Wrong model name or base URL (404).",
        "quota_reached": "Quota reached (429).",
        "timeout": "The request timed out.",
        "network_error": "A network error occurred.",
        "http_client_unavailable": "httpx is not installed; run: python -m pip install -r recommendation_agent/requirements.txt",
    }.get(error or "", "The API request did not succeed.")


def _list_models(base_url: str, api_key: str) -> None:
    if not api_key:
        print("API key is missing; cannot list models.")
        return
    try:
        import httpx
        response = httpx.get(base_url.rstrip("/") + "/models", headers={"Authorization": f"Bearer {api_key}"}, timeout=5.0)
        if response.status_code in {400, 401, 403}:
            print("Key is invalid or not authorized (400/401/403).")
            return
        if response.status_code == 404:
            print("Wrong base URL (404).")
            return
        if response.status_code == 429:
            print("Quota reached (429).")
            return
        response.raise_for_status()
        models = response.json().get("data", [])
        print("Available models (first 15):")
        for item in models[:15]:
            print("- " + str(item.get("id", "(unnamed)")))
    except httpx.TimeoutException:
        print("Model listing timed out.")
    except httpx.RequestError:
        print("Network error while listing models.")
    except Exception:
        print("Could not list models.")


def main() -> None:
    provider_name = os.getenv("RECOMMENDATION_LLM_PROVIDER", "").lower()
    model = os.getenv("RECOMMENDATION_LLM_MODEL", "")
    base_url = os.getenv("RECOMMENDATION_LLM_BASE_URL", GEMINI_OPENAI_COMPATIBLE_BASE_URL)
    api_key = get_llm_api_key()
    print(f"Provider: {provider_name or '(not set)'}")
    print(f"Model: {model or '(not set)'}")
    print(f"Base URL: {base_url}")
    print(f"API key: {_masked_key(api_key)}")
    if not model:
        _list_models(base_url, api_key)
        return
    generator = WhyLineGenerator(api_provider=ApiProvider())
    started = time.perf_counter()
    why, source = generator.generate_with_source(
        "science fiction", 0, "smoke", "candidate: title=Example; genres=Science Fiction; tags=#space; synopsis=A public space adventure.", "A public space adventure may fit your search."
    )
    latency_ms = (time.perf_counter() - started) * 1000
    print(f"Source: {source}")
    print(f"Latency: {latency_ms:.0f} ms")
    print(f"Why: {why}")
    if source != "api":
        print(_error_message(generator.api_provider.last_error))


if __name__ == "__main__":
    main()
