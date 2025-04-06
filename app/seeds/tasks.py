from app.models import db, Task, environment, SCHEMA
from datetime import datetime, timedelta

def seed_tasks():
    task1 = Task(
        user_id=1,
        tarantula_id=1,
        name="Feed tarantula",
        description="Give one cricket.",
        due_date=datetime.utcnow() + timedelta(days=3),
        interval_days=7
    )
    db.session.add(task1)
    db.session.commit()

def undo_tasks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tasks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tasks"))
    db.session.commit()