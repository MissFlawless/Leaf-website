from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required
from app.models import Chapter
from app.utils.recap_service import should_trigger_recap, generate_recap_result, update_reading_progress

recap_bp = Blueprint("recap", __name__)

@recap_bp.get("/check")
@jwt_required()
def check_recap():
    story_id = request.args.get("story_id", type=int)
    if story_id is None:
        return jsonify({"error": "story_id is required"}), 400

    trigger, content = should_trigger_recap(current_user.id, story_id)
    if trigger:
        result = generate_recap_result(content)
        return jsonify({"should_recap": True, **result})

    return jsonify({"should_recap": False})


@recap_bp.put("/progress")
@jwt_required()
def save_reading_progress():
    data = request.get_json() or {}
    story_id = data.get("story_id")
    chapter_id = data.get("chapter_id")
    if not isinstance(story_id, int) or not isinstance(chapter_id, int):
        return jsonify(error="story_id and chapter_id must be integers."), 400
    chapter = Chapter.query.filter_by(id=chapter_id, story_id=story_id, status="published").first()
    if chapter is None:
        return jsonify(error="Published chapter not found for this story."), 404
    position = data.get("position", 0)
    if not isinstance(position, int):
        return jsonify(error="position must be an integer."), 400
    update_reading_progress(current_user.id, story_id, chapter_id, max(0, position))
    return jsonify(saved=True), 200
