"""Add persisted recommendation embeddings."""
from alembic import op
import sqlalchemy as sa


revision = "0004_story_embeddings"
down_revision = "0003_notifications"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "story_embeddings",
        sa.Column("story_id", sa.Integer(), sa.ForeignKey("stories.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("model_name", sa.Text(), nullable=False),
        sa.Column("content_hash", sa.Text(), nullable=False),
        sa.Column("embedding", sa.LargeBinary(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
    )


def downgrade():
    op.drop_table("story_embeddings")
