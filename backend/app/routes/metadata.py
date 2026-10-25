"""Flask Blueprint — Story Metadata Agent routes.

Integrates the StoryMetadataAgent with the Leaf backend.

Security
--------
- All endpoints are protected by @author_required (JWT + role check).
- Only the author of the story may call these endpoints.
- Content is read from the database, never from the request body.
- LLM call failures degrade gracefully: HTTP 200 with fallback_used=True.

Endpoints (all prefixed /api by the blueprint registration)
-----------------------------------------------------------
  POST /stories/<id>/suggest-metadata   → analyse ALL chapters at once
  POST /stories/<id>/apply-metadata     → write blurb/genres/tags/warnings to DB
  POST /stories/<id>/generate-cover     → generate and attach AI book cover

  (Kept for backward compat)
  POST /chapters/<id>/suggest-metadata  → analyse single chapter
  POST /chapters/<id>/apply-metadata
  POST /chapters/<id>/generate-cover

Git isolation
-------------
This file is NEW – it does not modify any existing route file.
The only shared-file change is two lines in backend/app/__init__.py.
"""
from flask import Blueprint, jsonify
from flask_jwt_extended import current_user

from app.models import Chapter
from app.utils.security import author_required

bp = Blueprint("metadata", __name__)


# ═══════════════════════════════════════════════════════════════════════════
#  STORY-LEVEL ENDPOINTS  (primary — reads all chapters)
# ═══════════════════════════════════════════════════════════════════════════

@bp.post("/stories/<int:story_id>/suggest-metadata")
@author_required
def suggest_metadata_story(story_id: int):
    """Analyse ALL chapters of a story and return suggested metadata.

    Concatenates every chapter's content so the agent sees the whole book.
    """
    from app.extensions import db
    from app.models import Story
    from metadata_agent import ChapterAnalysisInput, StoryMetadataAgent
    from metadata_agent.config import AgentConfig

    story = db.session.get(Story, story_id)
    if story is None:
        return jsonify(error="Story not found."), 404
    if story.author_id != current_user.id:
        return jsonify(error="You can only analyse your own stories."), 403

    chapters = sorted(story.chapters, key=lambda c: c.position)
    if not chapters:
        return jsonify(error="This story has no chapters to analyse yet."), 400

    combined_html = ""
    for ch in chapters:
        combined_html += f"<h2>{ch.title}</h2>\n{ch.content or ''}\n"

    inp = ChapterAnalysisInput(
        chapter_html=combined_html,
        story_title=story.title,
        chapter_title=f"Full story ({len(chapters)} chapter(s))",
        chapter_position=1,
        existing_genres=[g.name for g in story.genres],
        existing_warnings=[w.name for w in story.warnings],
    )

    cfg = AgentConfig()
    agent = StoryMetadataAgent(config=cfg)
    result = agent.analyse(inp)

    return jsonify(metadata=result.to_dict()), 200


@bp.post("/stories/<int:story_id>/apply-metadata")
@author_required
def apply_metadata_story(story_id: int):
    """Write AI-generated metadata (blurb, genres, tags, warnings) to the Story."""
    from flask import request
    from app.extensions import db
    from app.models import Story, ContentWarning, Genre
    from app.routes.stories import get_or_create_tag, sync_recommendations
    from app.utils.serializers import story_card

    story = db.session.get(Story, story_id)
    if story is None:
        return jsonify(error="Story not found."), 404
    if story.author_id != current_user.id:
        return jsonify(error="You can only edit your own stories."), 403

    data = request.get_json() or {}
    blurb = (data.get("blurb") or "").strip()
    genres = data.get("genres") or []
    warnings = data.get("content_warnings") or data.get("warnings") or []
    tags = data.get("tags") or []

    if blurb:
        story.blurb = blurb
    if genres:
        story.genres = Genre.query.filter(Genre.name.in_(genres)).all()
    if warnings:
        story.warnings = ContentWarning.query.filter(ContentWarning.name.in_(warnings)).all()
    if tags:
        story.tags = [get_or_create_tag(t) for t in tags if t.strip()]

    db.session.commit()
    sync_recommendations(story.id)

    return jsonify(
        success=True,
        message="Metadata applied to story and synced with Recommendation Agent.",
        story=story_card(story),
    ), 200


@bp.post("/stories/<int:story_id>/generate-cover")
@author_required
def generate_cover_story(story_id: int):
    """Generate an artistic AI book cover for a story and attach it to story.cover."""
    import uuid
    from app.extensions import db
    from app.models import Story
    from app.routes.stories import sync_recommendations
    from app.utils.uploads import delete_image, upload_dir
    from metadata_agent.cover import generate_book_cover

    story = db.session.get(Story, story_id)
    if story is None:
        return jsonify(error="Story not found."), 404
    if story.author_id != current_user.id:
        return jsonify(error="You can only edit your own stories."), 403

    primary_genre = story.genres[0].name if story.genres else "Fantasy"
    author_name = current_user.display_name or current_user.username or "Leaf Author"
    tag_names = [t.name for t in story.tags]

    if story.cover:
        delete_image(story.cover)

    filename = f"{uuid.uuid4().hex}.png"
    dest_path = upload_dir() / filename
    generate_book_cover(
        title=story.title,
        author=author_name,
        genre=primary_genre,
        tags=tag_names,
        output_path=dest_path,
    )

    story.cover = filename
    db.session.commit()
    sync_recommendations(story.id)

    return jsonify(
        success=True,
        message="Book cover generated and saved to story.",
        cover_filename=filename,
        cover_url=f"/uploads/{filename}",
    ), 200


# ═══════════════════════════════════════════════════════════════════════════
#  CHAPTER-LEVEL ENDPOINTS  (kept for backward compatibility)
# ═══════════════════════════════════════════════════════════════════════════

@bp.post("/chapters/<int:chapter_id>/suggest-metadata")
@author_required
def suggest_metadata(chapter_id: int):
    """Analyse a single chapter (legacy — prefer the story-level endpoint)."""
    chapter = Chapter.query.get_or_404(chapter_id)
    if chapter.story.author_id != current_user.id:
        return jsonify(error="You can only analyse chapters from your own stories."), 403

    story = chapter.story
    from metadata_agent import ChapterAnalysisInput, StoryMetadataAgent
    from metadata_agent.config import AgentConfig

    inp = ChapterAnalysisInput(
        chapter_html=chapter.content or "",
        story_title=story.title,
        chapter_title=chapter.title,
        chapter_position=chapter.position,
        existing_genres=[g.name for g in story.genres],
        existing_warnings=[w.name for w in story.warnings],
    )

    cfg = AgentConfig()
    agent = StoryMetadataAgent(config=cfg)
    result = agent.analyse(inp)

    return jsonify(metadata=result.to_dict()), 200


@bp.post("/chapters/<int:chapter_id>/apply-metadata")
@author_required
def apply_metadata(chapter_id: int):
    """Apply metadata via chapter ID (legacy — prefer /stories/<id>/apply-metadata)."""
    from flask import request
    from app.extensions import db
    from app.models import Chapter, ContentWarning, Genre
    from app.routes.stories import get_or_create_tag, sync_recommendations
    from app.utils.serializers import story_card

    chapter = Chapter.query.get_or_404(chapter_id)
    story = chapter.story
    if story.author_id != current_user.id:
        return jsonify(error="You can only edit your own stories."), 403

    data = request.get_json() or {}
    blurb = (data.get("blurb") or "").strip()
    genres = data.get("genres") or []
    warnings = data.get("content_warnings") or data.get("warnings") or []
    tags = data.get("tags") or []

    if blurb:
        story.blurb = blurb
    if genres:
        story.genres = Genre.query.filter(Genre.name.in_(genres)).all()
    if warnings:
        story.warnings = ContentWarning.query.filter(ContentWarning.name.in_(warnings)).all()
    if tags:
        story.tags = [get_or_create_tag(t) for t in tags if t.strip()]

    db.session.commit()
    sync_recommendations(story.id)

    return jsonify(
        success=True,
        message="Metadata applied to story and synced with Recommendation Agent.",
        story=story_card(story),
    ), 200


@bp.post("/chapters/<int:chapter_id>/generate-cover")
@author_required
def generate_cover(chapter_id: int):
    """Generate cover via chapter ID (legacy — prefer /stories/<id>/generate-cover)."""
    import uuid
    from app.extensions import db
    from app.models import Chapter
    from app.routes.stories import sync_recommendations
    from app.utils.uploads import delete_image, upload_dir
    from metadata_agent.cover import generate_book_cover

    chapter = Chapter.query.get_or_404(chapter_id)
    story = chapter.story
    if story.author_id != current_user.id:
        return jsonify(error="You can only edit your own stories."), 403

    primary_genre = story.genres[0].name if story.genres else "Fantasy"
    author_name = current_user.display_name or current_user.username or "Leaf Author"
    tag_names = [t.name for t in story.tags]

    if story.cover:
        delete_image(story.cover)

    filename = f"{uuid.uuid4().hex}.png"
    dest_path = upload_dir() / filename
    generate_book_cover(
        title=story.title,
        author=author_name,
        genre=primary_genre,
        tags=tag_names,
        output_path=dest_path,
    )

    story.cover = filename
    db.session.commit()
    sync_recommendations(story.id)

    return jsonify(
        success=True,
        message="Book cover generated and saved to story.",
        cover_filename=filename,
        cover_url=f"/uploads/{filename}",
    ), 200
