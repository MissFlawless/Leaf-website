import json
import httpx
import logging
import os
from recommendation_agent.explain import WhyLineGenerator, valid_why
from recommendation_agent.explain import ApiProvider
from recommendation_agent.models import Story
from recommendation_agent.prompts import public_story_context


class FakeProvider:
    def __init__(self, response): self.response = response
    def generate(self, _prompt): return self.response


def test_api_json_is_used_and_invalid_responses_fall_back():
    generator = WhyLineGenerator(api_provider=FakeProvider(json.dumps({"why": "Its magical dragon adventure fits your search."})), local_enabled=False)
    assert generator.generate_with_source("dragons", 1, "hash", "public context", "template") == ("Its magical dragon adventure fits your search.", "api")
    bad = WhyLineGenerator(api_provider=FakeProvider('{"why":"Read https://bad.test now."}'), local_enabled=False)
    assert bad.generate_with_source("dragons", 2, "hash", "public context", "template")[1] == "template"


def test_only_public_bounded_story_fields_enter_context():
    story = Story(1, "Title", "x" * 600, ["Fantasy"], ["dragon"], author_id=99, author_name="Private Name")
    context = public_story_context(story, story)
    assert "Private Name" not in context and "99" not in context
    assert len(context.split("synopsis=")[1].split("\n")[0]) <= 500


class FakeResponse:
    def __init__(self, status_code=200, payload=None):
        self.status_code = status_code
        self.payload = payload or {"choices": [{"message": {"content": '{"why":"Its public genre and tags match your search."}'}}]}

    def raise_for_status(self):
        if self.status_code >= 400:
            raise httpx.HTTPStatusError("status", request=httpx.Request("POST", "https://example.test"), response=httpx.Response(self.status_code))

    def json(self):
        return self.payload


class FakeClient:
    def __init__(self, result): self.result = result
    def post(self, *_args, **_kwargs):
        if isinstance(self.result, Exception): raise self.result
        return self.result


def test_openai_compatible_valid_response_and_safe_request_shape():
    client = FakeClient(FakeResponse())
    provider = ApiProvider("openai_compatible", "gemini-test", api_key="secret-value", base_url="https://example.test/v1/", client=client)
    assert valid_why(provider.generate("prompt"), "prompt") == "Its public genre and tags match your search."
    assert provider.last_error is None
    assert "secret-value" not in repr(provider)


def test_openai_compatible_failures_fall_back_without_leaking_key(caplog):
    caplog.set_level(logging.DEBUG)
    for status in (400, 401, 403, 404, 429):
        provider = ApiProvider("openai_compatible", "gemini-test", api_key="do-not-log-this", client=FakeClient(FakeResponse(status)))
        generator = WhyLineGenerator(api_provider=provider, local_enabled=False)
        assert generator.generate_with_source("query", status, "hash", "public", "template") == ("template", "template")
        assert "do-not-log-this" not in repr(provider)
    timeout = ApiProvider("openai_compatible", "gemini-test", api_key="do-not-log-this", client=FakeClient(httpx.TimeoutException("timeout")))
    assert timeout.generate("prompt") is None and timeout.last_error == "timeout"
    assert "do-not-log-this" not in caplog.text


def test_missing_key_uses_template_and_environment_wins_over_dotenv(monkeypatch):
    monkeypatch.delenv("RECOMMENDATION_LLM_API_KEY", raising=False)
    missing = ApiProvider("openai_compatible", "gemini-test", client=FakeClient(FakeResponse()))
    assert missing.generate("prompt") is None and missing.last_error == "missing_key"
    monkeypatch.setenv("RECOMMENDATION_LLM_API_KEY", "from-environment")
    from dotenv import load_dotenv
    load_dotenv(".env.example", override=False)
    assert os.environ["RECOMMENDATION_LLM_API_KEY"] == "from-environment"


def test_check_llm_reports_missing_key_cleanly(monkeypatch, capsys):
    from recommendation_agent import check_llm
    monkeypatch.setenv("RECOMMENDATION_LLM_PROVIDER", "openai_compatible")
    monkeypatch.setenv("RECOMMENDATION_LLM_MODEL", "gemini-test")
    monkeypatch.delenv("RECOMMENDATION_LLM_API_KEY", raising=False)
    check_llm.main()
    output = capsys.readouterr().out
    assert "API key: not present" in output
    assert "API key is missing." in output
