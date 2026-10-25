"""Moderation API endpoints."""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required

from app.extensions import db
from app.models import Comment, Story
from app.moderation import get_moderation_service
from app.utils.notifications import notify_moderation_event

bp = Blueprint("moderation", __name__)


@bp.post("/moderation/check")
@jwt_required(optional=True)
def check_content():
    """Inspect arbitrary text for toxicity, spam, and inappropriate content."""
    data = request.get_json() or {}
    text = (data.get("text") or "").strip()
    title = (data.get("title") or "").strip()
    content_type = data.get("content_type", "comment")

    if not text and not title:
        return jsonify(error="Text or title is required for moderation check."), 400

    service = get_moderation_service()
    if content_type == "chapter":
        result = service.agent.check_chapter(title=title, content=text)
    else:
        result = service.agent.check_comment(text)

    return jsonify(moderation=result.to_dict())


@bp.post("/moderation/report-comment")
@jwt_required()
def report_comment():
    """Report a comment on a book details page for moderation review."""
    data = request.get_json() or {}
    comment_id = data.get("comment_id")
    user_reason = (data.get("reason") or "Inappropriate content").strip()

    if not comment_id:
        return jsonify(error="Comment ID is required."), 400

    comment = Comment.query.get_or_404(comment_id)
    service = get_moderation_service()
    mod_result = service.agent.check_comment(comment.body)

    # Hide comment pending human review
    comment.hidden = True

    # Send moderation notification to the reporter
    notify_moderation_event(
        user_id=current_user.id,
        story_id=comment.story_id,
        chapter_id=comment.chapter_id,
        title="Report received",
        body=f"Thank you for reporting. The comment on '{comment.story.title}' is now hidden pending review.",
    )

    # Send moderation notification to the comment author
    if comment.user_id != current_user.id:
        notify_moderation_event(
            user_id=comment.user_id,
            story_id=comment.story_id,
            chapter_id=comment.chapter_id,
            title="Comment flagged for review",
            body=f"Your comment on '{comment.story.title}' was reported ({user_reason}) and is hidden pending review.",
        )

    # Send notification to the story author
    if comment.story.author_id not in {current_user.id, comment.user_id}:
        notify_moderation_event(
            user_id=comment.story.author_id,
            story_id=comment.story_id,
            chapter_id=comment.chapter_id,
            title="Comment reported on your story",
            body=f"A comment on '{comment.story.title}' was reported and placed under review.",
        )

    db.session.commit()
    return jsonify(
        message="Comment has been reported and placed under moderation review.",
        moderation=mod_result.to_dict(),
    )


@bp.post("/moderation/report-story")
@jwt_required()
def report_story():
    """Report a story/book from the book details page for moderation review."""
    data = request.get_json() or {}
    story_id = data.get("story_id")
    user_reason = (data.get("reason") or "Content concerns").strip()

    if not story_id:
        return jsonify(error="Story ID is required."), 400

    story = Story.query.get_or_404(story_id)
    service = get_moderation_service()
    mod_result = service.agent.check_text(f"{story.title}\n{story.blurb}")

    # Notify reporter
    notify_moderation_event(
        user_id=current_user.id,
        story_id=story.id,
        title="Story report received",
        body=f"Thank you. Your report for '{story.title}' has been submitted for moderation review.",
    )

    # Notify author
    notify_moderation_event(
        user_id=story.author_id,
        story_id=story.id,
        title="Story reported for moderation",
        body=f"Your story '{story.title}' was reported ({user_reason}) and is being reviewed.",
    )

    db.session.commit()
    return jsonify(
        message="Thank you for your report. It has been submitted for moderation review.",
        moderation=mod_result.to_dict(),
    )
