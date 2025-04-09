from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Task(db.Model):
    __tablename__ = "tasks"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    tarantula_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("tarantulas.id")), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.DateTime, nullable=False)
    interval_days = db.Column(db.Integer, nullable=False, default=7)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="tasks")
    tarantula = db.relationship("Tarantula", back_populates="tasks")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "tarantula_id": self.tarantula_id,
            "name": self.name,
            "description": self.description,
            "due_date": self.due_date.isoformat(),
            "completed": self.completed,
            "interval_days": self.interval_days,
            "created_at": self.created_at.isoformat(), 
        }
