from app.extensions import db
from app.models import Notification, ShelfEntry


def notify_story_followers(story, chapter, action):
    """Create one update notification for every other account saving a story."""
    entries = ShelfEntry.query.filter_by(story_id=story.id).all()
    recipients = {entry.user_id for entry in entries if entry.user_id != story.author_id}
    if not recipients:
        return
    if action == "published":
        title = f"New chapter in {story.title}"
        body = f"{chapter.title} is ready to read."
    else:
        title = f"Updated chapter in {story.title}"
        body = f"{chapter.title} has been updated."
    for user_id in recipients:
        db.session.add(Notification(
            user_id=user_id, story_id=story.id, chapter_id=chapter.id,
            title=title, body=body, kind="chapter_update",
        ))


def notify_moderation_event(user_id, title, body, story_id=None, chapter_id=None):
    """Create a moderation notification for a user."""
    db.session.add(Notification(
        user_id=user_id,
        story_id=story_id,
        chapter_id=chapter_id,
        title=title,
        body=body,
        kind="moderation",
    ))

