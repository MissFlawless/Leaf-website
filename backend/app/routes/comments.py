from flask import Blueprint, jsonify, request
from flask_jwt_extended import current_user, jwt_required
from app.extensions import db
from app.models import Chapter, Comment, Story
from app.utils.serializers import comment_json

bp = Blueprint("comments", __name__)


def list_comments(story_id, chapter_id=None):
    query = Comment.query.filter_by(story_id=story_id, parent_id=None)
    if chapter_id:
        query = query.filter_by(chapter_id=chapter_id)
    else:
        query = query.filter_by(chapter_id=None)
    return [comment_json(c, current_user) for c in query.order_by(Comment.created_at.desc()).all()]


@bp.get("/stories/<int:story_id>/comments")
@jwt_required(optional=True)
def story_comments(story_id):
    Story.query.get_or_404(story_id)
    return jsonify(items=list_comments(story_id))


@bp.get("/chapters/<int:chapter_id>/comments")
@jwt_required(optional=True)
def chapter_comments(chapter_id):
    chapter = Chapter.query.get_or_404(chapter_id)
    return jsonify(items=list_comments(chapter.story_id, chapter.id))


def create_comment(story, chapter_id=None):
    data = request.get_json() or {}
    body = (data.get("body") or "").strip()
    if len(body) < 2:
        return jsonify(error="Comment is too short."), 400
    parent_id = data.get("parent_id")
    if parent_id:
        parent = Comment.query.get_or_404(parent_id)
        if parent.parent_id or parent.story_id != story.id:
            return jsonify(error="Invalid reply target."), 400

    from app.moderation import get_moderation_service
    from app.utils.notifications import notify_moderation_event

    mod_result = get_moderation_service().agent.check_comment(body)
    if mod_result.is_flagged:
        notify_moderation_event(
            user_id=current_user.id,
            story_id=story.id,
            chapter_id=chapter_id,
            title="Comment flagged by moderation",
            body=f"Your comment on '{story.title}' was flagged for {', '.join(mod_result.categories) or 'inappropriate content'}: {mod_result.reason}",
        )
        db.session.commit()
        return jsonify(
            error="Your comment was flagged by moderation and could not be posted.",
            moderation=mod_result.to_dict(),
        ), 400

    comment = Comment(
        body=body,
        story_id=story.id,
        chapter_id=chapter_id,
        user_id=current_user.id,
        parent_id=parent_id,
        hidden=mod_result.requires_review,
    )
    db.session.add(comment)

    if mod_result.requires_review:
        notify_moderation_event(
            user_id=current_user.id,
            story_id=story.id,
            chapter_id=chapter_id,
            title="Comment pending review",
            body=f"Your comment on '{story.title}' contains sensitive terms and is pending review.",
        )
        if story.author_id != current_user.id:
            notify_moderation_event(
                user_id=story.author_id,
                story_id=story.id,
                chapter_id=chapter_id,
                title="Comment requires review",
                body=f"A new comment on '{story.title}' requires review: \"{body[:60]}...\"",
            )

    db.session.commit()
    resp_data = {"comment": comment_json(comment, current_user)}
    if mod_result.requires_review:
        resp_data["message"] = "Your comment requires review before appearing publicly."
        resp_data["moderation"] = mod_result.to_dict()
    return jsonify(resp_data), 201


@bp.post("/stories/<int:story_id>/comments")
@jwt_required()
def add_story_comment(story_id):
    return create_comment(Story.query.get_or_404(story_id))


@bp.post("/chapters/<int:chapter_id>/comments")
@jwt_required()
def add_chapter_comment(chapter_id):
    chapter = Chapter.query.get_or_404(chapter_id)
    return create_comment(chapter.story, chapter.id)


@bp.delete("/comments/<int:comment_id>")
@jwt_required()
def delete_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    if current_user.id not in {comment.user_id, comment.story.author_id}:
        return jsonify(error="You cannot delete this comment."), 403
    db.session.delete(comment)
    db.session.commit()
    return jsonify(message="Comment deleted.")


@bp.put("/comments/<int:comment_id>/hide")
@jwt_required()
def hide_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    if current_user.id != comment.story.author_id:
        return jsonify(error="Only the story author can hide comments."), 403
    new_hidden = bool((request.get_json() or {}).get("hidden", True))
    comment.hidden = new_hidden
    if not new_hidden and comment.user_id != current_user.id:
        from app.utils.notifications import notify_moderation_event
        notify_moderation_event(
            user_id=comment.user_id,
            story_id=comment.story_id,
            title="Comment approved",
            body=f"Your comment on '{comment.story.title}' was reviewed and approved by the author.",
        )
    db.session.commit()
    return jsonify(comment=comment_json(comment, current_user))


@bp.get("/me/comments-on-my-stories")
@jwt_required()
def my_story_comments():
    if current_user.role != "author":
        return jsonify(error="Authors only."), 403
    comments = Comment.query.join(Story).filter(Story.author_id == current_user.id).order_by(Comment.created_at.desc()).limit(50).all()
    return jsonify(items=[comment_json(c, current_user) for c in comments])
