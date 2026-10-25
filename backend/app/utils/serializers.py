from datetime import date, datetime
from app.models import Chapter, ShelfEntry


def iso(value):
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    return value


def upload_url(filename):
    return f"/uploads/{filename}" if filename else None


def user_public(user):
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "display_name": user.display_name,
        "bio": user.bio or "",
        "avatar_url": upload_url(user.avatar),
        "cover_url": upload_url(user.cover),
        "role": user.role,
    }


def story_card(story):
    published = [c for c in story.chapters if c.status == "published"]
    return {
        "id": story.id,
        "title": story.title,
        "blurb": story.blurb,
        "cover_url": upload_url(story.cover),
        "status": story.status,
        "mature": story.mature,
        "author": user_public(story.author),
        "genres": [g.name for g in story.genres],
        "tags": [t.name for t in story.tags],
        "warnings": [w.name for w in story.warnings],
        "chapter_count": len(story.chapters),
        "published_chapter_count": len(published),
        "word_count": sum(c.word_count for c in story.chapters),
        "updated_at": iso(story.updated_at),
        "created_at": iso(story.created_at),
    }


def chapter_json(chapter, include_content=True):
    data = {
        "id": chapter.id,
        "story_id": chapter.story_id,
        "title": chapter.title,
        "position": chapter.position,
        "status": chapter.status,
        "word_count": chapter.word_count,
        "created_at": iso(chapter.created_at),
        "updated_at": iso(chapter.updated_at),
        "published_at": iso(chapter.published_at),
    }
    if include_content:
        data["content"] = chapter.content or ""
    return data


def comment_json(comment, viewer=None):
    hidden = comment.hidden and (not viewer or viewer.id not in {comment.user_id, comment.story.author_id})
    return {
        "id": comment.id,
        "body": "Hidden by the author" if hidden else comment.body,
        "hidden": comment.hidden,
        "created_at": iso(comment.created_at),
        "user": user_public(comment.user),
        "parent_id": comment.parent_id,
        "story_id": comment.story_id,
        "chapter_id": comment.chapter_id,
        "replies": [comment_json(r, viewer) for r in comment.replies],
    }


def shelf_json(entry):
    read_count = 0
    if entry.last_chapter:
        read_count = sum(1 for chapter in entry.story.chapters if chapter.status == "published" and chapter.position <= entry.last_chapter.position)
    return {
        "id": entry.id,
        "shelf": entry.shelf,
        "story": story_card(entry.story),
        "last_chapter": chapter_json(entry.last_chapter, False) if entry.last_chapter else None,
        "read_chapter_count": read_count,
        "last_chapter_index": read_count - 1 if read_count else 0,
        "updated_at": iso(entry.updated_at),
    }


def notification_json(notification):
    return {
        "id": notification.id,
        "title": notification.title,
        "body": notification.body,
        "kind": notification.kind,
        "read": notification.read,
        "story_id": notification.story_id,
        "chapter_id": notification.chapter_id,
        "created_at": iso(notification.created_at),
    }
