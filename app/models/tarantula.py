from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from .favorite import Favorite 

class Tarantula(db.Model):
    __tablename__ = "tarantulas"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String(88), nullable=True)
    species = db.Column(db.String(100))
    age = db.Column(db.Integer)
    description = db.Column(db.Text())
    location = db.Column(db.String(255), nullable=True)  
    image = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship 
    favorited_by = relationship("Favorite", back_populates="tarantula", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "species": self.species,
            "age": self.age,
            "description": self.description,
            "location": self.location,
            "image": self.image,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
