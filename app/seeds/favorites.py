from app.models import db, User, Tarantula, favorites, environment, SCHEMA
from sqlalchemy.sql import text

def seed_favorites():
    user1 = User.query.get(1)
    tarantula1 = Tarantula.query.get(2)
    tarantula2 = Tarantula.query.get(3)

    user1.favorite_tarantulas.append(tarantula1)
    user1.favorite_tarantulas.append(tarantula2)

    db.session.commit()

def undo_favorites():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.favorites RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM favorites"))

    db.session.commit()
