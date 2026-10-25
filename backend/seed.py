import argparse
from datetime import datetime, timedelta
from app import create_app
from app.extensions import db
from app.models import Chapter, Comment, ContentWarning, Genre, MoodItem, Note, Notebook, ShelfEntry, Story, Tag, User

GENRES = ["Fantasy", "Mystery", "Romance", "Science Fiction", "Historical", "Contemporary", "Adventure", "Horror"]
WARNINGS = ["Violence", "Grief", "Strong language", "Mature themes", "Death", "Substance use"]


def user(email, username, role, display_name):
    existing = User.query.filter((User.email == email) | (User.username == username)).first()
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


def seed_recommendation_catalog():
    """Create an idempotent catalog with clear recommendation neighborhoods."""
    author = user("missflawless@leaf.test", "missflawless", "author", "MissFlawless")
    db.session.commit()
    genres = {genre.name: genre for genre in Genre.query.all()}
    catalog = [
        # These five should be strongly related to a Briar House search.
        ("The Briar House Correspondence", "An archivist catalogues letters from a ruined manor that answer questions before anyone asks them.", "Historical", ["historical", "serial", "gothic", "epistolary", "archive", "family-secret"]),
        ("Ashes at Wren Hall", "A young historian restores a fire-damaged estate archive and uncovers a century of hidden family letters.", "Historical", ["historical", "serial", "gothic", "epistolary", "archive", "family-secret"]),
        ("The Inkkeeper's Promise", "In 1890, a reluctant curator follows an unsigned correspondence through a crumbling country house.", "Historical", ["historical", "serial", "gothic", "epistolary", "archive", "manor"]),
        ("The Last Room at Hawthorn Manor", "A housemaid finds a locked library where every old letter reveals another branch of a vanished family.", "Historical", ["historical", "serial", "gothic", "family-secret", "manor", "mystery"]),
        ("A Catalogue of Lost Names", "A quiet librarian reconstructs a forgotten woman's life from diaries, catalog cards, and sealed post.", "Historical", ["historical", "serial", "epistolary", "archive", "literary", "mystery"]),
        # Deliberately unrelated controls make relevance testing easier.
        ("Neon Tide Protocol", "A deep-sea engineer races to stop an autonomous city from flooding the last coastal refuge on Earth.", "Science Fiction", ["cyberpunk", "ocean", "technology", "thriller"]),
        ("The Ember Crown", "A disgraced dragon rider must choose between restoring a stolen crown and saving the village that exiled her.", "Fantasy", ["dragons", "magic", "quest", "war"]),
        ("Sunday at Mango Street", "A Nigerian chef opens a tiny neighborhood restaurant and learns that second chances arrive one table at a time.", "Contemporary", ["food", "community", "healing", "slice-of-life"]),
        ("The Alpine Witness", "A forensic climber investigates a death on an isolated mountain trail before the next storm buries the evidence.", "Mystery", ["detective", "mountains", "suspense", "crime"]),
        ("Orbiting June", "Two astronauts on separate missions exchange voice notes while deciding whether a long-distance love can survive space.", "Romance", ["space", "love", "letters", "hope"]),
    ]
    for title, blurb, genre_name, tags in catalog:
        story = Story.query.filter_by(title=title, author_id=author.id).first()
        if story:
            continue
        story = Story(title=title, blurb=blurb, status="published", mature=False, author=author)
        story.genres = [genres[genre_name]]
        story.tags = [tag(name) for name in tags]
        db.session.add(story)
        db.session.flush()
        db.session.add(Chapter(
            story_id=story.id, title="Chapter 1", position=1, status="published", word_count=60,
            published_at=datetime.utcnow(),
            content=f"<p>{blurb} The opening chapter introduces a choice that changes everything.</p>",
        ))
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
        seed_recommendation_catalog()
        print("Seed complete.")


if __name__ == "__main__":
    main()
