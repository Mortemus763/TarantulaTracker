from app.models import db, ForumReply, environment, SCHEMA
from sqlalchemy.sql import text

def seed_forum_replies():
    reply1 = ForumReply(
        post_id=1, user_id=2, content="I think the Mexican Red Knee is the best for beginners!"
    )
    reply2 = ForumReply(
        post_id=1, user_id=3, content="I started with a Chilean Rose, super easy to care for!"
    )
    reply3 = ForumReply(
        post_id=2, user_id=1, content="Yes, burrowing is normal. Some species love to dig tunnels!"
    )

    db.session.add(reply1)
    db.session.add(reply2)
    db.session.add(reply3)
    db.session.commit()

def undo_forum_replies():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.forum_replies RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM forum_replies"))

    db.session.commit()
