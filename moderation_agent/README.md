# Moderation Agent — Leaf Website

The **Moderation Agent** is an isolated, modular component that analyzes user comments and story chapters on the Leaf platform for:
- **Toxicity & Hate Speech**: slurs, violent threats, self-harm encouragement, severe hostility
- **Harassment**: targeted personal attacks, abuse
- **Spam & Scams**: cryptocurrency scams, social metric manipulation, suspicious referral links, repetitive gibberish
- **Explicit Content**: adult/NSFW content inappropriate for general sections
- **Borderline / Sensitive Content**: heated critique, sensitive disclosures requiring human review

Content is classified into three distinct statuses:
1. `approved`: Safe, constructive, and compliant with community guidelines.
2. `flagged`: Severe violations that are blocked with an immediate explanation and a moderation notification to the user.
3. `needs_review`: Sensitive or borderline content held for review (marked `hidden=True` for comments) with notifications sent to both the user and the story author.

---

## Configuration & Environment Variables

The Moderation Agent's configuration and environment variables are strictly isolated from the Recommendation Agent.

| Variable | Default | Description |
|---|---|---|
| `MODERATION_LLM_API_KEY` | `""` | Optional Gemini / OpenAI-compatible API key. If absent, the agent relies entirely on fast, deterministic rule matching. |
| `MODERATION_LLM_MODEL` | `""` | Model identifier (e.g., `gemini-1.5-flash` or `gpt-4o-mini`). |
| `MODERATION_LLM_PROVIDER` | `""` | Provider identifier (e.g., `openai_compatible`). |
| `MODERATION_LLM_BASE_URL` | `https://generativelanguage.googleapis.com/v1beta/openai/` | Base URL for LLM API requests. |
| `MODERATION_LOCAL_ENABLED` | `true` | Enables local deterministic rule checks and offline fallback. |
| `MODERATION_STRICT_MODE` | `false` | When true, rule-based review triggers take precedence even if LLM evaluates as approved. |
| `MODERATION_TIMEOUT_SECONDS` | `5.0` | Timeout for external LLM classification requests before falling back to rules. |

---

## Architecture

- **`models.py`**: Declares `ModerationStatus` (`approved`, `flagged`, `needs_review`), `ModerationCategory`, and `ModerationResult`.
- **`rules.py`**: Fast, deterministic regex, pattern, and heuristic matching engine. Strips HTML for chapter text and checks toxicity, harassment, spam, explicit keywords, and borderline triggers.
- **`llm_classifier.py`**: Connects to optional OpenAI-compatible / Gemini endpoints. Gracefully catches timeouts, network dropouts, rate limits, and invalid formats to fall back to the rules engine without throwing exceptions.
- **`agent.py`**: `ModerationAgent` coordinates rule checks, optional LLM evaluations, and fallback aggregation.

---

## Workflow & Backend Integration

- **Comments (`backend/app/routes/comments.py`)**:
  - `POST /api/stories/<id>/comments` & `POST /api/chapters/<id>/comments`:
    - Clean content is approved and posted immediately.
    - Flagged content is blocked with HTTP 400 and sends a `kind="moderation"` notification to the user.
    - Borderline content (`needs_review`) is saved with `hidden=True`, and notifications are dispatched to both the commenter and the story author.
- **Chapters (`backend/app/routes/chapters.py`)**:
  - `POST /api/stories/<id>/chapters` & `PUT /api/chapters/<id>`:
    - When publishing, content and title are moderated.
    - Flagged chapters are blocked from publishing, returning HTTP 400 and alerting the author via a moderation notification.
- **Direct Check Endpoint (`backend/app/routes/moderation.py`)**:
  - `POST /api/moderation/check`: Exposes direct testing/preview of text moderation without mutating database records.

---

## Running Tests

### Moderation Agent Tests:
```powershell
python -m pytest moderation_agent/tests
```
Tests cover:
- Benign reader comments and wholesome chapter text (`test_normal_content.py`)
- Toxic slurs, self-harm encouragement, and violent threats (`test_toxic_content.py`)
- Cryptocurrency, follower, and shortened link spam (`test_spam_content.py`)
- Heated criticism and sensitive disclosures requiring review (`test_borderline_cases.py`)
- Provider network timeouts, 500s, and invalid JSON fallbacks (`test_provider_failures.py`)

### Backend Integration Tests:
```powershell
python -m pytest backend/tests
```
Verifies:
- All core CRUD and permission flows (`test_core.py`)
- Comment and chapter moderation lifecycle and notifications (`test_moderation.py`)
- Recommendation searches, vectors, and "why" explanations (`test_recommendations.py`)

### Recommendation Agent Tests:
```powershell
python -m pytest recommendation_agent/tests
```
Ensures 100% preservation and isolation of the existing Recommendation Agent.
