from app.models import db, forum_post_tags, ForumPost, Tag, environment, SCHEMA
from sqlalchemy.sql import text

def seed_forum_post_tags():
    post1 = ForumPost.query.get(1)
    post2 = ForumPost.query.get(2)
    post3 = ForumPost.query.get(3)

    tag1 = Tag.query.get(1)  # Beginner
    tag2 = Tag.query.get(2)  # Care Guide
    tag3 = Tag.query.get(3)  # Humidity

    post1.tags.append(tag1)  # Beginner tag
    post2.tags.append(tag2)  # Care Guide tag
    post3.tags.append(tag3)  # Humidity tag

    db.session.commit()

def undo_forum_post_tags():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.forum_post_tags RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM forum_post_tags"))

    db.session.commit()
