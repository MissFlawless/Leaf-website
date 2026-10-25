"""Add user profile cover image."""
from alembic import op
import sqlalchemy as sa

revision = "0002_user_cover"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("cover", sa.String(length=255), nullable=True))


def downgrade():
    op.drop_column("users", "cover")
