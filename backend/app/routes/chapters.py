import re
from datetime import datetime
import bleach
from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required
from app.extensions import db
from app.models import Chapter, ShelfEntry, Story, WritingLog
from app.utils.security import author_required
from app.utils.serializers import chapter_json


def sync_recommendations(story_id):
    try:
        from flask import current_app
        service = current_app.extensions.get("recommendations")
        if service:
            service.sync_story(story_id)
    except Exception:
        pass
from app.utils.notifications import notify_story_followers

bp = Blueprint("chapters", __name__)
ALLOWED_TAGS = ["p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "ul", "ol", "li", "blockquote", "hr", "div", "span"]
ALLOWED_ATTRS = {}


def word_count(html):
    text = re.sub(r"<[^>]+>", " ", html or "")
    return len(re.findall(r"\b[\w']+\b", text))


def clean_html(html):
    return bleach.clean(html or "", tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS, strip=True)


def add_writing_log(user_id, delta):
    if delta <= 0:
        return
    today = datetime.utcnow().date()
    log = WritingLog.query.filter_by(user_id=user_id, log_date=today).first()
    if not log:
        log = WritingLog(user_id=user_id, log_date=today, words_added=0)
        db.session.add(log)
    log.words_added += delta


def ensure_owner(story):
    return story.author_id == current_user.id


@bp.get("/stories/<int:story_id>/chapters")
@jwt_required(optional=True)
def chapters(story_id):
    story = Story.query.get_or_404(story_id)
    owner = current_user and current_user.id == story.author_id
    items = [c for c in story.chapters if owner or c.status == "published"]
    return jsonify(items=[chapter_json(c, False) for c in items])


@bp.post("/stories/<int:story_id>/chapters")
@author_required
def create_chapter(story_id):
    story = Story.query.get_or_404(story_id)
    if not ensure_owner(story):
        return jsonify(error="You cannot edit another author's story."), 403
    data = request.get_json() or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify(error="Chapter title is required."), 400
    content = clean_html(data.get("content", ""))
    wc = word_count(content)
    chapter = Chapter(
        story_id=story.id,
        title=title,
        content=content,
        status=data.get("status") if data.get("status") in {"draft", "published"} else "draft",
        position=len(story.chapters) + 1,
        word_count=wc,
        published_at=datetime.utcnow() if data.get("status") == "published" else None,
    )
    if chapter.status == "published":
        story.status = "published"
        story.updated_at = datetime.utcnow()
        notify_story_followers(story, chapter, "published")
    add_writing_log(current_user.id, wc)
    db.session.add(chapter)
    db.session.commit()
    sync_recommendations(story.id)
    return jsonify(chapter=chapter_json(chapter)), 201


@bp.get("/chapters/<int:chapter_id>")
@jwt_required()
def chapter_detail(chapter_id):
    chapter = Chapter.query.get_or_404(chapter_id)
    owner = current_user.id == chapter.story.author_id
    if chapter.status != "published" and not owner:
        return jsonify(error="Not found."), 404
    if chapter.status == "published":
        entry = ShelfEntry.query.filter_by(user_id=current_user.id, story_id=chapter.story_id).first()
        if not entry:
            entry = ShelfEntry(user_id=current_user.id, story_id=chapter.story_id, shelf="Reading")
            db.session.add(entry)
        entry.last_chapter_id = chapter.id
        db.session.commit()
    ordered = [c for c in chapter.story.chapters if c.status == "published" or owner]
    index = next((i for i, c in enumerate(ordered) if c.id == chapter.id), 0)
    return jsonify(
        chapter=chapter_json(chapter),
        story={"id": chapter.story.id, "title": chapter.story.title},
        previous=chapter_json(ordered[index - 1], False) if index > 0 else None,
        next=chapter_json(ordered[index + 1], False) if index < len(ordered) - 1 else None,
    )


@bp.put("/chapters/<int:chapter_id>")
@author_required
def update_chapter(chapter_id):
    chapter = Chapter.query.get_or_404(chapter_id)
    if chapter.story.author_id != current_user.id:
        return jsonify(error="You cannot edit another author's chapter."), 403
    data = request.get_json() or {}
    was_published = chapter.status == "published"
    had_edit = any(key in data for key in ("title", "content"))
    if data.get("title") is not None:
        title = data["title"].strip()
        if not title:
            return jsonify(error="Chapter title is required."), 400
        chapter.title = title
    old_wc = chapter.word_count
    if "content" in data:
        chapter.content = clean_html(data.get("content"))
        chapter.word_count = word_count(chapter.content)
        add_writing_log(current_user.id, chapter.word_count - old_wc)
    if data.get("status") in {"draft", "published"}:
        if chapter.status != "published" and data["status"] == "published":
            chapter.published_at = datetime.utcnow()
        chapter.status = data["status"]
        if chapter.status == "published":
            chapter.story.status = "published"
            chapter.story.updated_at = datetime.utcnow()
    if chapter.status == "published" and (not was_published or had_edit):
        notify_story_followers(chapter.story, chapter, "updated" if was_published else "published")
    db.session.commit()
    sync_recommendations(chapter.story_id)
    return jsonify(chapter=chapter_json(chapter))


@bp.delete("/chapters/<int:chapter_id>")
@author_required
def delete_chapter(chapter_id):
    chapter = Chapter.query.get_or_404(chapter_id)
    if chapter.story.author_id != current_user.id:
        return jsonify(error="You cannot delete another author's chapter."), 403
    story = chapter.story
    db.session.delete(chapter)
    db.session.flush()
    for i, c in enumerate(story.chapters, 1):
        c.position = i
    db.session.commit()
    sync_recommendations(story.id)
    return jsonify(message="Chapter deleted.")


@bp.put("/stories/<int:story_id>/chapters/reorder")
@author_required
def reorder(story_id):
    story = Story.query.get_or_404(story_id)
    if not ensure_owner(story):
        return jsonify(error="You cannot reorder another author's chapters."), 403
    ids = request.get_json().get("chapter_ids", [])
    chapters = {c.id: c for c in story.chapters}
    if set(ids) != set(chapters):
        return jsonify(error="Chapter order must include every chapter."), 400
    for position, chapter_id in enumerate(ids, 1):
        chapters[chapter_id].position = position
    db.session.commit()
    return jsonify(items=[chapter_json(c, False) for c in story.chapters])
