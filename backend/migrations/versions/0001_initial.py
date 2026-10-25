"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-10-12
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table("users", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("email", sa.String(255), nullable=False), sa.Column("username", sa.String(80), nullable=False), sa.Column("display_name", sa.String(120), nullable=False), sa.Column("bio", sa.Text()), sa.Column("avatar", sa.String(255)), sa.Column("role", sa.String(20), nullable=False), sa.Column("password_hash", sa.String(255), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False), sa.Column("updated_at", sa.DateTime(), nullable=False))
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_username", "users", ["username"], unique=True)
    op.create_table("genres", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("name", sa.String(80), nullable=False, unique=True))
    op.create_table("tags", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("name", sa.String(80), nullable=False, unique=True))
    op.create_index("ix_tags_name", "tags", ["name"])
    op.create_table("content_warnings", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("name", sa.String(120), nullable=False, unique=True))
    op.create_table("stories", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("title", sa.String(180), nullable=False), sa.Column("blurb", sa.Text(), nullable=False), sa.Column("cover", sa.String(255)), sa.Column("status", sa.String(20), nullable=False), sa.Column("mature", sa.Boolean(), nullable=False), sa.Column("author_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False), sa.Column("updated_at", sa.DateTime(), nullable=False))
    op.create_index("ix_stories_author_id", "stories", ["author_id"])
    op.create_index("ix_stories_status", "stories", ["status"])
    op.create_index("ix_stories_title", "stories", ["title"])
    op.create_table("story_genres", sa.Column("story_id", sa.Integer(), sa.ForeignKey("stories.id", ondelete="CASCADE"), primary_key=True), sa.Column("genre_id", sa.Integer(), sa.ForeignKey("genres.id", ondelete="CASCADE"), primary_key=True))
    op.create_table("story_tags", sa.Column("story_id", sa.Integer(), sa.ForeignKey("stories.id", ondelete="CASCADE"), primary_key=True), sa.Column("tag_id", sa.Integer(), sa.ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True))
    op.create_table("story_warnings", sa.Column("story_id", sa.Integer(), sa.ForeignKey("stories.id", ondelete="CASCADE"), primary_key=True), sa.Column("warning_id", sa.Integer(), sa.ForeignKey("content_warnings.id", ondelete="CASCADE"), primary_key=True))
    op.create_table("chapters", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("title", sa.String(180), nullable=False), sa.Column("content", sa.Text()), sa.Column("position", sa.Integer(), nullable=False), sa.Column("status", sa.String(20), nullable=False), sa.Column("word_count", sa.Integer(), nullable=False), sa.Column("published_at", sa.DateTime()), sa.Column("story_id", sa.Integer(), sa.ForeignKey("stories.id", ondelete="CASCADE"), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False), sa.Column("updated_at", sa.DateTime(), nullable=False))
    op.create_index("ix_chapters_story_id", "chapters", ["story_id"])
    op.create_index("ix_chapters_status", "chapters", ["status"])
    op.create_index("ix_chapters_position", "chapters", ["position"])
    op.create_table("comments", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("body", sa.Text(), nullable=False), sa.Column("hidden", sa.Boolean(), nullable=False), sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False), sa.Column("story_id", sa.Integer(), sa.ForeignKey("stories.id", ondelete="CASCADE"), nullable=False), sa.Column("chapter_id", sa.Integer(), sa.ForeignKey("chapters.id", ondelete="CASCADE")), sa.Column("parent_id", sa.Integer(), sa.ForeignKey("comments.id", ondelete="CASCADE")), sa.Column("created_at", sa.DateTime(), nullable=False), sa.Column("updated_at", sa.DateTime(), nullable=False))
    op.create_index("ix_comments_story_id", "comments", ["story_id"])
    op.create_index("ix_comments_chapter_id", "comments", ["chapter_id"])
    op.create_table("shelf_entries", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("shelf", sa.String(40), nullable=False), sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False), sa.Column("story_id", sa.Integer(), sa.ForeignKey("stories.id", ondelete="CASCADE"), nullable=False), sa.Column("last_chapter_id", sa.Integer(), sa.ForeignKey("chapters.id", ondelete="SET NULL")), sa.Column("created_at", sa.DateTime(), nullable=False), sa.Column("updated_at", sa.DateTime(), nullable=False), sa.UniqueConstraint("user_id", "story_id", name="uq_shelf_user_story"))
    op.create_index("ix_shelf_entries_user_id", "shelf_entries", ["user_id"])
    op.create_index("ix_shelf_entries_story_id", "shelf_entries", ["story_id"])
    op.create_table("notebooks", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("title", sa.String(160), nullable=False), sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False), sa.Column("story_id", sa.Integer(), sa.ForeignKey("stories.id", ondelete="SET NULL")), sa.Column("created_at", sa.DateTime(), nullable=False), sa.Column("updated_at", sa.DateTime(), nullable=False))
    op.create_index("ix_notebooks_user_id", "notebooks", ["user_id"])
    op.create_table("notes", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("title", sa.String(160), nullable=False), sa.Column("content", sa.Text()), sa.Column("color", sa.String(40)), sa.Column("pinned", sa.Boolean(), nullable=False), sa.Column("notebook_id", sa.Integer(), sa.ForeignKey("notebooks.id", ondelete="CASCADE"), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False), sa.Column("updated_at", sa.DateTime(), nullable=False))
    op.create_index("ix_notes_notebook_id", "notes", ["notebook_id"])
    op.create_table("mood_items", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("type", sa.String(30), nullable=False), sa.Column("value", sa.Text(), nullable=False), sa.Column("caption", sa.String(255)), sa.Column("position", sa.Integer(), nullable=False), sa.Column("notebook_id", sa.Integer(), sa.ForeignKey("notebooks.id", ondelete="CASCADE"), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False), sa.Column("updated_at", sa.DateTime(), nullable=False))
    op.create_index("ix_mood_items_notebook_id", "mood_items", ["notebook_id"])
    op.create_table("writing_log", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False), sa.Column("log_date", sa.Date(), nullable=False), sa.Column("words_added", sa.Integer(), nullable=False), sa.UniqueConstraint("user_id", "log_date", name="uq_writing_log_user_date"))
    op.create_index("ix_writing_log_user_id", "writing_log", ["user_id"])
    op.create_index("ix_writing_log_log_date", "writing_log", ["log_date"])


def downgrade():
    for table in ["writing_log", "mood_items", "notes", "notebooks", "shelf_entries", "comments", "chapters", "story_warnings", "story_tags", "story_genres", "stories", "content_warnings", "tags", "genres", "users"]:
        op.drop_table(table)
