from datetime import datetime, date
from werkzeug.security import check_password_hash, generate_password_hash
from app.extensions import db

story_genres = db.Table(
    "story_genres",
    db.Column("story_id", db.Integer, db.ForeignKey("stories.id", ondelete="CASCADE"), primary_key=True),
    db.Column("genre_id", db.Integer, db.ForeignKey("genres.id", ondelete="CASCADE"), primary_key=True),
)

story_tags = db.Table(
    "story_tags",
    db.Column("story_id", db.Integer, db.ForeignKey("stories.id", ondelete="CASCADE"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)

story_warnings = db.Table(
    "story_warnings",
    db.Column("story_id", db.Integer, db.ForeignKey("stories.id", ondelete="CASCADE"), primary_key=True),
    db.Column("warning_id", db.Integer, db.ForeignKey("content_warnings.id", ondelete="CASCADE"), primary_key=True),
)


class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class User(TimestampMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    username = db.Column(db.String(80), nullable=False, unique=True, index=True)
    display_name = db.Column(db.String(120), nullable=False)
    bio = db.Column(db.Text, default="")
    avatar = db.Column(db.String(255))
    cover = db.Column(db.String(255))
    role = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    stories = db.relationship("Story", back_populates="author", cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Genre(db.Model):
    __tablename__ = "genres"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)


class Tag(db.Model):
    __tablename__ = "tags"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True, index=True)


class ContentWarning(db.Model):
    __tablename__ = "content_warnings"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=True)


class Story(TimestampMixin, db.Model):
    __tablename__ = "stories"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(180), nullable=False, index=True)
    blurb = db.Column(db.Text, nullable=False)
    cover = db.Column(db.String(255))
    status = db.Column(db.String(20), nullable=False, default="draft", index=True)
    mature = db.Column(db.Boolean, default=False, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    author = db.relationship("User", back_populates="stories")
    genres = db.relationship("Genre", secondary=story_genres, lazy="selectin")
    tags = db.relationship("Tag", secondary=story_tags, lazy="selectin")
    warnings = db.relationship("ContentWarning", secondary=story_warnings, lazy="selectin")
    chapters = db.relationship("Chapter", back_populates="story", cascade="all, delete-orphan", order_by="Chapter.position")
    comments = db.relationship("Comment", back_populates="story", cascade="all, delete-orphan")
    shelf_entries = db.relationship("ShelfEntry", back_populates="story", cascade="all, delete-orphan")


class Chapter(TimestampMixin, db.Model):
    __tablename__ = "chapters"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(180), nullable=False)
    content = db.Column(db.Text, default="")
    position = db.Column(db.Integer, nullable=False, index=True)
    status = db.Column(db.String(20), default="draft", nullable=False, index=True)
    word_count = db.Column(db.Integer, default=0, nullable=False)
    published_at = db.Column(db.DateTime)
    story_id = db.Column(db.Integer, db.ForeignKey("stories.id", ondelete="CASCADE"), nullable=False, index=True)
    story = db.relationship("Story", back_populates="chapters")


class Comment(TimestampMixin, db.Model):
    __tablename__ = "comments"
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text, nullable=False)
    hidden = db.Column(db.Boolean, default=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    story_id = db.Column(db.Integer, db.ForeignKey("stories.id", ondelete="CASCADE"), nullable=False, index=True)
    chapter_id = db.Column(db.Integer, db.ForeignKey("chapters.id", ondelete="CASCADE"), index=True)
    parent_id = db.Column(db.Integer, db.ForeignKey("comments.id", ondelete="CASCADE"))
    user = db.relationship("User")
    story = db.relationship("Story", back_populates="comments")
    chapter = db.relationship("Chapter")
    replies = db.relationship("Comment", cascade="all, delete-orphan")


class ShelfEntry(TimestampMixin, db.Model):
    __tablename__ = "shelf_entries"
    id = db.Column(db.Integer, primary_key=True)
    shelf = db.Column(db.String(40), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    story_id = db.Column(db.Integer, db.ForeignKey("stories.id", ondelete="CASCADE"), nullable=False, index=True)
    last_chapter_id = db.Column(db.Integer, db.ForeignKey("chapters.id", ondelete="SET NULL"))
    user = db.relationship("User")
    story = db.relationship("Story", back_populates="shelf_entries")
    last_chapter = db.relationship("Chapter")
    __table_args__ = (db.UniqueConstraint("user_id", "story_id", name="uq_shelf_user_story"),)


class Notification(TimestampMixin, db.Model):
    __tablename__ = "notifications"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(180), nullable=False)
    body = db.Column(db.Text, nullable=False)
    kind = db.Column(db.String(40), nullable=False, default="story_update")
    read = db.Column(db.Boolean, nullable=False, default=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    story_id = db.Column(db.Integer, db.ForeignKey("stories.id", ondelete="CASCADE"), index=True)
    chapter_id = db.Column(db.Integer, db.ForeignKey("chapters.id", ondelete="CASCADE"), index=True)
    user = db.relationship("User")
    story = db.relationship("Story")
    chapter = db.relationship("Chapter")


class Notebook(TimestampMixin, db.Model):
    __tablename__ = "notebooks"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    story_id = db.Column(db.Integer, db.ForeignKey("stories.id", ondelete="SET NULL"))
    notes = db.relationship("Note", cascade="all, delete-orphan", back_populates="notebook")
    mood_items = db.relationship("MoodItem", cascade="all, delete-orphan", back_populates="notebook", order_by="MoodItem.position")


class Note(TimestampMixin, db.Model):
    __tablename__ = "notes"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    content = db.Column(db.Text, default="")
    color = db.Column(db.String(40), default="#FDF8EC")
    pinned = db.Column(db.Boolean, default=False, nullable=False)
    notebook_id = db.Column(db.Integer, db.ForeignKey("notebooks.id", ondelete="CASCADE"), nullable=False, index=True)
    notebook = db.relationship("Notebook", back_populates="notes")


class MoodItem(TimestampMixin, db.Model):
    __tablename__ = "mood_items"
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(30), nullable=False)
    value = db.Column(db.Text, nullable=False)
    caption = db.Column(db.String(255), default="")
    position = db.Column(db.Integer, nullable=False, default=1)
    notebook_id = db.Column(db.Integer, db.ForeignKey("notebooks.id", ondelete="CASCADE"), nullable=False, index=True)
    notebook = db.relationship("Notebook", back_populates="mood_items")


class WritingLog(db.Model):
    __tablename__ = "writing_log"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    log_date = db.Column(db.Date, default=date.today, nullable=False, index=True)
    words_added = db.Column(db.Integer, default=0, nullable=False)
    __table_args__ = (db.UniqueConstraint("user_id", "log_date", name="uq_writing_log_user_date"),)
