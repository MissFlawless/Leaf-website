from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required
from sqlalchemy import func, or_
from app.extensions import db
from app.models import Chapter, Comment, ContentWarning, Genre, ShelfEntry, Story, Tag, User
from app.utils.security import author_required
from app.utils.serializers import chapter_json, story_card
from app.utils.uploads import delete_image, save_image


def sync_recommendations(story_id):
    """Recommendation problems must never prevent a story mutation from succeeding."""
    try:
        from flask import current_app
        service = current_app.extensions.get("recommendations")
        if service:
            service.sync_story(story_id)
    except Exception:
        # The service logs its own failures; never include story text or secrets here.
        pass

bp = Blueprint("stories", __name__)
VALID_STATUSES = {"draft", "published", "completed"}


def get_or_create_tag(name):
    clean = name.strip().lower()
    tag = Tag.query.filter(func.lower(Tag.name) == clean).first()
    if not tag:
        tag = Tag(name=clean)
        db.session.add(tag)
    return tag


def apply_story_fields(story, data):
    title = (data.get("title") or "").strip()
    blurb = (data.get("blurb") or "").strip()
    status = data.get("status", story.status)
    if len(title) < 2:
        return "Title must be at least 2 characters."
    if len(blurb) < 10:
        return "Blurb must be at least 10 characters."
    if status not in VALID_STATUSES:
        return "Invalid story status."
    if status in {"published", "completed"} and not any(c.status == "published" for c in story.chapters):
        return "Publish at least one chapter before publishing this story."
    story.title = title
    story.blurb = blurb
    story.status = status
    story.mature = bool(data.get("mature", False))
    story.genres = Genre.query.filter(Genre.name.in_(data.get("genres") or [])).all()
    story.warnings = ContentWarning.query.filter(ContentWarning.name.in_(data.get("warnings") or [])).all()
    story.tags = [get_or_create_tag(t) for t in data.get("tags", []) if t.strip()]
    return None


def visible_query():
    return Story.query.join(Chapter).filter(Story.status.in_(["published", "completed"]), Chapter.status == "published").distinct()


@bp.get("/stories")
def stories():
    q = (request.args.get("q") or "").strip().lower()
    genre = request.args.get("genre")
    tag = request.args.get("tag")
    sort = request.args.get("sort", "newest")
    page = max(int(request.args.get("page", 1)), 1)
    per_page = min(max(int(request.args.get("per_page", 9)), 1), 100)
    query = visible_query()
    if q:
        query = query.join(User, Story.author_id == User.id).outerjoin(Story.tags).filter(
            or_(func.lower(Story.title).contains(q), func.lower(User.username).contains(q), func.lower(Tag.name).contains(q))
        )
    if genre:
        query = query.join(Story.genres).filter(Genre.name == genre)
    if tag:
        query = query.join(Story.tags).filter(Tag.name == tag)
    if sort == "trending":
        ids = [s["id"] for s in trending_items()]
        if ids:
            query = query.filter(Story.id.in_(ids))
    else:
        query = query.order_by(Story.updated_at.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify(items=[story_card(s) for s in pagination.items], page=page, pages=pagination.pages, total=pagination.total)


def trending_items(limit=10):
    since = datetime.utcnow() - timedelta(days=7)
    shelf_counts = dict(db.session.query(ShelfEntry.story_id, func.count(ShelfEntry.id)).filter(ShelfEntry.created_at >= since).group_by(ShelfEntry.story_id))
    comment_counts = dict(db.session.query(Comment.story_id, func.count(Comment.id)).filter(Comment.created_at >= since).group_by(Comment.story_id))
    scores = {sid: shelf_counts.get(sid, 0) + comment_counts.get(sid, 0) for sid in set(shelf_counts) | set(comment_counts)}
    stories = visible_query().all()
    ranked = sorted(stories, key=lambda s: (scores.get(s.id, 0), s.updated_at), reverse=True)[:limit]
    return [story_card(s) for s in ranked]


@bp.get("/stories/trending")
def trending():
    return jsonify(items=trending_items())


@bp.get("/stories/<int:story_id>")
@jwt_required(optional=True)
def story_detail(story_id):
    story = db.session.get(Story, story_id) or Story.query.filter_by(id=story_id).first_or_404()
    if story.status == "draft" or not any(c.status == "published" for c in story.chapters):
        if not current_user or current_user.id != story.author_id:
            return jsonify(error="Not found."), 404
    return jsonify(story=story_card(story), chapters=[chapter_json(c, False) for c in story.chapters if c.status == "published" or (current_user and current_user.id == story.author_id)])


@bp.post("/stories")
@author_required
def create_story():
    story = Story(author_id=current_user.id, title="", blurb="")
    error = apply_story_fields(story, request.get_json() or {})
    if error:
        return jsonify(error=error), 400
    db.session.add(story)
    db.session.commit()
    sync_recommendations(story.id)
    return jsonify(story=story_card(story)), 201


@bp.put("/stories/<int:story_id>")
@author_required
def update_story(story_id):
    story = Story.query.get_or_404(story_id)
    if story.author_id != current_user.id:
        return jsonify(error="You cannot edit another author's story."), 403
    error = apply_story_fields(story, request.get_json() or {})
    if error:
        return jsonify(error=error), 400
    db.session.commit()
    sync_recommendations(story.id)
    return jsonify(story=story_card(story))


@bp.delete("/stories/<int:story_id>")
@author_required
def delete_story(story_id):
    story = Story.query.get_or_404(story_id)
    if story.author_id != current_user.id:
        return jsonify(error="You cannot delete another author's story."), 403
    delete_image(story.cover)
    db.session.delete(story)
    db.session.commit()
    sync_recommendations(story_id)
    return jsonify(message="Story deleted.")


@bp.post("/stories/<int:story_id>/cover")
@author_required
def cover(story_id):
    story = Story.query.get_or_404(story_id)
    if story.author_id != current_user.id:
        return jsonify(error="You cannot edit another author's story."), 403
    try:
        filename = save_image(request.files.get("image"))
    except ValueError as exc:
        return jsonify(error=str(exc)), 400
    delete_image(story.cover)
    story.cover = filename
    db.session.commit()
    return jsonify(story=story_card(story))


@bp.delete("/stories/<int:story_id>/cover")
@author_required
def remove_cover(story_id):
    story = Story.query.get_or_404(story_id)
    if story.author_id != current_user.id:
        return jsonify(error="You cannot edit another author's story."), 403
    delete_image(story.cover)
    story.cover = None
    db.session.commit()
    return jsonify(story=story_card(story))


@bp.get("/me/stories")
@author_required
def my_stories():
    return jsonify(items=[story_card(s) for s in Story.query.filter_by(author_id=current_user.id).order_by(Story.updated_at.desc()).all()])
