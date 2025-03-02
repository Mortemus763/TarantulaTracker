from app.models import db, Tag, environment, SCHEMA
from sqlalchemy.sql import text

def seed_tags():
    tag1 = Tag(name="Beginner")
    tag2 = Tag(name="Care Guide")
    tag3 = Tag(name="Humidity")
    tag4 = Tag(name="Enclosure Setup")

    db.session.add(tag1)
    db.session.add(tag2)
    db.session.add(tag3)
    db.session.add(tag4)
    db.session.commit()

def undo_tags():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tags RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tags"))

    db.session.commit()