"""Track reader chapter progress for return recaps."""
from alembic import op
import sqlalchemy as sa


revision = "0005_reading_sessions"
down_revision = "0004_story_embeddings"
branch_labels = None
depends_on = None


def upgrade():
    if not sa.inspect(op.get_bind()).has_table("reading_sessions"):
        op.create_table(
            "reading_sessions",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
            sa.Column("story_id", sa.Integer(), sa.ForeignKey("stories.id", ondelete="CASCADE"), nullable=False),
            sa.Column("chapter_id", sa.Integer(), sa.ForeignKey("chapters.id", ondelete="SET NULL")),
            sa.Column("last_position", sa.Integer(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=False),
            sa.Column("updated_at", sa.DateTime(), nullable=False),
        )
        op.create_index("ix_reading_sessions_user_id", "reading_sessions", ["user_id"])
        op.create_index("ix_reading_sessions_story_id", "reading_sessions", ["story_id"])


def downgrade():
    op.drop_table("reading_sessions")
