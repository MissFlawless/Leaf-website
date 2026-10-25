import argparse
from datetime import datetime, timedelta
from app import create_app
from app.extensions import db
from app.models import Chapter, Comment, ContentWarning, Genre, MoodItem, Note, Notebook, ShelfEntry, Story, Tag, User

GENRES = ["Fantasy", "Mystery", "Romance", "Science Fiction", "Historical", "Contemporary", "Adventure", "Horror"]
WARNINGS = ["Violence", "Grief", "Strong language", "Mature themes", "Death", "Substance use"]


def user(email, username, role, display_name):
    existing = User.query.filter_by(email=email).first()
    if existing:
        return existing
    u = User(email=email, username=username, role=role, display_name=display_name, bio=f"{display_name} writes and reads on Leaf.")
    u.set_password("Password123!")
    db.session.add(u)
    return u


def tag(name):
    t = Tag.query.filter_by(name=name).first()
    if not t:
        t = Tag(name=name)
        db.session.add(t)
    return t


def seed_taxonomy():
    for name in GENRES:
        if not Genre.query.filter_by(name=name).first():
            db.session.add(Genre(name=name))
    for name in WARNINGS:
        if not ContentWarning.query.filter_by(name=name).first():
            db.session.add(ContentWarning(name=name))
    db.session.commit()


def seed_demo():
    author = user("author@leaf.test", "leafauthor", "author", "Leaf Author")
    reader = user("reader@leaf.test", "leafreader", "reader", "Leaf Reader")
    authors = [author, user("mira@leaf.test", "mira", "author", "Mira Stone"), user("jon@leaf.test", "jonvale", "author", "Jon Vale")]
    db.session.commit()
    if Story.query.count() >= 6:
        return
    genres = {g.name: g for g in Genre.query.all()}
    warnings = {w.name: w for w in ContentWarning.query.all()}
    titles = [
        ("Lanterns Under Rain", "A courier follows vanishing lights through a city that rewrites its streets each midnight.", "Fantasy"),
        ("The Orchard Key", "Two siblings inherit a key that opens every door except the one beneath their childhood home.", "Mystery"),
        ("After the Ninth Signal", "A mechanic on a quiet moon station receives a message from a ship that never launched.", "Science Fiction"),
        ("Small Hours Cafe", "Regulars at an all-night cafe trade secrets, recipes, and second chances.", "Contemporary"),
        ("The Glass Cartographer", "A mapmaker discovers a kingdom hidden inside the flaws of antique glass.", "Adventure"),
        ("Letters from Briar House", "An archivist catalogues letters that answer questions before anyone asks them.", "Historical"),
    ]
    for i, (title, blurb, genre_name) in enumerate(titles):
        story = Story(title=title, blurb=blurb, status="published", mature=False, author=authors[i % len(authors)])
        story.genres = [genres[genre_name]]
        story.tags = [tag(genre_name.lower()), tag("serial")]
        if i % 3 == 0:
            story.warnings = [warnings["Grief"]]
        db.session.add(story)
        db.session.flush()
        for pos in range(1, 4):
            text = f"<p>Chapter {pos} opens with a choice, a remembered promise, and a quiet turn toward the unknown. The scene keeps moving through sensory details, conflict, and a small discovery that changes what the characters believe.</p>"
            db.session.add(Chapter(story_id=story.id, title=f"Chapter {pos}", content=text, position=pos, status="published", word_count=37, published_at=datetime.utcnow() - timedelta(days=pos)))
        db.session.flush()
        db.session.add(Comment(body="I loved the pacing in this chapter.", story_id=story.id, user_id=reader.id))
        db.session.add(ShelfEntry(user_id=reader.id, story_id=story.id, shelf="Reading"))
    db.session.commit()
    nb = Notebook.query.filter_by(user_id=author.id, title="First Story Notebook").first()
    if not nb:
        nb = Notebook(user_id=author.id, title="First Story Notebook", story_id=Story.query.filter_by(author_id=author.id).first().id)
        db.session.add(nb)
        db.session.flush()
        db.session.add(Note(notebook_id=nb.id, title="Opening image", content="A warm window seen from a rainy lane.", color="#FDF8EC", pinned=True))
        db.session.add(MoodItem(notebook_id=nb.id, type="color", value="#E8C65A", caption="Soft gold accent", position=1))
        db.session.commit()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--no-demo", action="store_true")
    args = parser.parse_args()
    app = create_app()
    with app.app_context():
        seed_taxonomy()
        if not args.no_demo:
            seed_demo()
        print("Seed complete.")


if __name__ == "__main__":
    main()
