from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import current_user, jwt_required

from app.models import ShelfEntry
from app.recommendations import get_recommendations, initialize_recommendations
from recommendation_agent.text_utils import normalize

bp = Blueprint("recommendations", __name__)


def _service():
    service = get_recommendations(current_app)
    if service is None and current_app.config.get("TESTING"):
        initialize_recommendations(current_app)
        service = get_recommendations(current_app)
    return service


def _story(story):
    return {
        "id": story.id, "title": story.title, "author": story.author_name,
        "cover_url": story.cover_url, "genres": story.genres, "tags": story.tags,
        "blurb": story.synopsis or "", "content_warnings": story.content_warnings,
    }


def _match_type(result):
    if not result.primary:
        return None
    if result.intent == "TITLE":
        return "exact_title" if normalize(result.query) == normalize(result.primary.title) else "fuzzy_title"
    if result.intent == "GENRE":
        return "genre"
    if result.intent == "TAG":
        return "tag"
    return "description"


def _limit(value):
    try:
        value = int(value)
    except (TypeError, ValueError):
        return None
    return value if 1 <= value <= 20 else None


@bp.get("/recommendations/search")
@jwt_required(optional=True)
def search():
    query = (request.args.get("q") or "").strip()
    limit = _limit(request.args.get("limit", 8))
    if not 1 <= len(query) <= 200 or limit is None:
        return jsonify(error="q must be 1-200 characters and limit must be 1-20."), 400
    service = _service()
    if service is None:
        return jsonify(error="Recommendations are temporarily unavailable."), 503
    result = service.agent.search(query, k=20)
    excluded = set()
    if current_user:
        excluded = {
            story_id for (story_id,) in ShelfEntry.query.with_entities(ShelfEntry.story_id).filter(
                ShelfEntry.user_id == current_user.id, ShelfEntry.shelf.in_(["Reading", "Finished"])
            ).all()
        }
    rows = [row for row in result.recommendations if row.story.id not in excluded][:limit]
    return jsonify(
        query=query, intent=result.intent, match_type=_match_type(result),
        primary=_story(result.primary) if result.primary else None,
        recommendations=[{
            "story": _story(row.story), "score": row.score, "reasons": row.reasons,
            "shared_genres": row.shared_genres, "shared_tags": row.shared_tags,
        } for row in rows], degraded=result.degraded,
    )


@bp.post("/recommendations/why")
@jwt_required(optional=True)
def why():
    data = request.get_json(silent=True) or {}
    query = (data.get("query") or "").strip()
    story_ids = data.get("story_ids")
    if not 1 <= len(query) <= 200 or not isinstance(story_ids, list) or len(story_ids) > 20 or not all(isinstance(item, int) for item in story_ids):
        return jsonify(error="query must be 1-200 characters and story_ids must contain at most 20 integers."), 400
    service = _service()
    if service is None:
        return jsonify(error="Recommendations are temporarily unavailable."), 503
    try:
        values = service.why(query, story_ids)
    except Exception:
        # A provider failure is never client-visible; retain a deterministic explanation.
        values = {str(story_id): {"text": "A close match for your search.", "source": "template"} for story_id in story_ids}
    return jsonify(why=values)


@bp.get("/stories/<int:story_id>/similar")
def similar(story_id):
    limit = _limit(request.args.get("limit", 8))
    if limit is None:
        return jsonify(error="limit must be 1-20."), 400
    service = _service()
    if service is None:
        return jsonify(error="Recommendations are temporarily unavailable."), 503
    story = service.repository.get_story(story_id)
    if not story:
        return jsonify(error="Not found."), 404
    rows = service.agent.similar_to(story_id, limit)
    return jsonify(items=[{
        "story": _story(row.story), "score": row.score, "reasons": row.reasons,
        "shared_genres": row.shared_genres, "shared_tags": row.shared_tags,
    } for row in rows])
