from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required
from app.extensions import db
from app.models import Chapter, ShelfEntry, Story
from app.utils.serializers import shelf_json

bp = Blueprint("library", __name__)
SHELVES = {"Reading", "Plan to read", "Finished"}


@bp.get("/library")
@jwt_required()
def library():
    entries = ShelfEntry.query.filter_by(user_id=current_user.id).order_by(ShelfEntry.updated_at.desc()).all()
    return jsonify(items=[shelf_json(e) for e in entries])


@bp.put("/stories/<int:story_id>/shelf")
@jwt_required()
def shelf(story_id):
    Story.query.get_or_404(story_id)
    shelf_name = (request.get_json() or {}).get("shelf")
    if shelf_name not in SHELVES:
        return jsonify(error="Choose a valid shelf."), 400
    entry = ShelfEntry.query.filter_by(user_id=current_user.id, story_id=story_id).first()
    if not entry:
        entry = ShelfEntry(user_id=current_user.id, story_id=story_id, shelf=shelf_name)
        db.session.add(entry)
    entry.shelf = shelf_name
    db.session.commit()
    return jsonify(entry=shelf_json(entry))


@bp.delete("/stories/<int:story_id>/shelf")
@jwt_required()
def remove_shelf(story_id):
    entry = ShelfEntry.query.filter_by(user_id=current_user.id, story_id=story_id).first_or_404()
    db.session.delete(entry)
    db.session.commit()
    return jsonify(message="Removed from library.")


@bp.put("/stories/<int:story_id>/bookmark")
@jwt_required()
def bookmark(story_id):
    chapter_id = (request.get_json() or {}).get("chapter_id")
    chapter = Chapter.query.filter_by(id=chapter_id, story_id=story_id).first_or_404()
    entry = ShelfEntry.query.filter_by(user_id=current_user.id, story_id=story_id).first()
    if not entry:
        entry = ShelfEntry(user_id=current_user.id, story_id=story_id, shelf="Reading")
        db.session.add(entry)
    entry.last_chapter_id = chapter.id
    db.session.commit()
    return jsonify(entry=shelf_json(entry))
