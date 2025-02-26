from app.models import db, Tarantula, environment, SCHEMA
from sqlalchemy.sql import text

def seed_tarantulas():
    tarantula1 = Tarantula(
        user_id=1, name="Brachypelma Smithi", species="Mexican Red Knee", age=3, description="A beautiful and docile tarantula."
    )
    tarantula2 = Tarantula(
        user_id=2, name="Grammostola Rosea", species="Chilean Rose", age=5, description="Great for beginners!"
    )
    tarantula3 = Tarantula(
        user_id=3, name="Chromatopelma Cyaneopubescens", species="Green Bottle Blue", age=2, description="Vibrant colors and web-heavy behavior."
    )

    db.session.add(tarantula1)
    db.session.add(tarantula2)
    db.session.add(tarantula3)
    db.session.commit()

def undo_tarantulas():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tarantulas RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tarantulas"))
        
    db.session.commit()