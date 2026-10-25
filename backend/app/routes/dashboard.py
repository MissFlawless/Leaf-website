from datetime import date, datetime, timedelta
from flask import Blueprint, jsonify
from flask_jwt_extended import current_user, jwt_required
from sqlalchemy import func
from app.models import Comment, ShelfEntry, Story, WritingLog
from app.routes.stories import trending_items
from app.utils.serializers import shelf_json, story_card

bp = Blueprint("dashboard", __name__)


def streak(user_id):
    days = {r.log_date for r in WritingLog.query.filter(WritingLog.user_id == user_id, WritingLog.words_added > 0).all()}
    count = 0
    day = date.today()
    while day in days:
        count += 1
        day -= timedelta(days=1)
    return count


@bp.get("/me/dashboard")
@jwt_required()
def dashboard():
    if current_user.role == "author":
        since = datetime.utcnow() - timedelta(days=7)
        stories = Story.query.filter_by(author_id=current_user.id).order_by(Story.updated_at.desc()).all()
        words = sum(w.words_added for w in WritingLog.query.filter(WritingLog.user_id == current_user.id, WritingLog.log_date >= since.date()).all())
        reader_ids = set()
        story_ids = [s.id for s in stories]
        if story_ids:
            reader_ids.update(i[0] for i in ShelfEntry.query.with_entities(ShelfEntry.user_id).filter(ShelfEntry.story_id.in_(story_ids)).distinct())
            reader_ids.update(i[0] for i in Comment.query.with_entities(Comment.user_id).filter(Comment.story_id.in_(story_ids)).distinct())
        latest_chapter = None
        latest_story = stories[0] if stories else None
        if latest_story and latest_story.chapters:
            latest_chapter = max(latest_story.chapters, key=lambda c: c.updated_at)
        return jsonify(
            role="author",
            greeting_name=current_user.display_name,
            continue_writing={"story": story_card(latest_story) if latest_story else None, "chapter": latest_chapter.title if latest_chapter else None},
            stories=[story_card(s) for s in stories],
            week={"words": words, "stories_updated": sum(1 for s in stories if s.updated_at >= since), "readers": len(reader_ids), "streak": streak(current_user.id)},
            trending=trending_items(5),
        )
    entries = ShelfEntry.query.filter_by(user_id=current_user.id).order_by(ShelfEntry.updated_at.desc()).all()
    return jsonify(
        role="reader",
        continue_reading=[shelf_json(e) for e in entries if e.last_chapter_id][:6],
        shelf_counts={name: sum(1 for e in entries if e.shelf == name) for name in ["Reading", "Plan to read", "Finished"]},
        trending=trending_items(5),
        newest=[story_card(s) for s in Story.query.filter(Story.status.in_(["published", "completed"])).order_by(Story.updated_at.desc()).limit(6).all()],
    )
