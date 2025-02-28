from app.models import db, ForumPost, environment, SCHEMA
from sqlalchemy.sql import text

def seed_forum_posts():
    post1 = ForumPost(
        user_id=1, title="Best beginner tarantula?", content="Looking for a tarantula that's easy to care for."
    )
    post2 = ForumPost(
        user_id=2, title="Why does my tarantula burrow?", content="My tarantula started burrowing. Is this normal?"
    )
    post3 = ForumPost(
        user_id=3, title="Best humidity levels?", content="What are the ideal humidity levels for a Brachypelma Smithi?"
    )

    db.session.add(post1)
    db.session.add(post2)
    db.session.add(post3)
    db.session.commit()

def undo_forum_posts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.forum_posts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM forum_posts"))

    db.session.commit()
