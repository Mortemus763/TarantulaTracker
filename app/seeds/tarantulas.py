from app.models import db, Tarantula, environment, SCHEMA
from sqlalchemy.sql import text

def seed_tarantulas():
    tarantula1 = Tarantula(
        user_id=1,
        name="Mexican Red Knee",
        species="Brachypelma Smithi",
        age=3,
        description="A beautiful and docile tarantula.",
        location="Mexico",  
        image="https://example.com/brachypelma-smithi.jpg"  
    )
    tarantula2 = Tarantula(
        user_id=2,
        name="Chilean Rose",
        species="Grammostola Rosea",
        age=5,
        description="Great for beginners!",
        location="Chile",  
        image="https://example.com/grammostola-rosea.jpg"  
    )
    tarantula3 = Tarantula(
        user_id=3,
        name="Green Bottle Blue",
        species="Chromatopelma Cyaneopubescens",
        age=2,
        description="Vibrant colors and web-heavy behavior.",
        location="Venezuela",  
        image="https://example.com/green-bottle-blue.jpg"  
    )

    db.session.add_all([tarantula1, tarantula2, tarantula3])  
    db.session.commit()

def undo_tarantulas():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tarantulas RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tarantulas"))

    db.session.commit()
