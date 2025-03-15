from app.models import db, User, Tarantula, Favorite, environment, SCHEMA
from sqlalchemy.sql import text

def seed_favorites():
    user1 = User.query.get(1)
    tarantula1 = Tarantula.query.get(2)
    tarantula2 = Tarantula.query.get(3)

    if user1 and tarantula1 and tarantula2:
        favorite1 = Favorite(user_id=user1.id, tarantula_id=tarantula1.id)
        favorite2 = Favorite(user_id=user1.id, tarantula_id=tarantula2.id)

        db.session.add_all([favorite1, favorite2])
        db.session.commit()

def undo_favorites():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.favorites RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM favorites"))

    db.session.commit()
