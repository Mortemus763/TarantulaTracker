from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, ForeignKey

class Favorite(db.Model):
    __tablename__ = "favorites"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    tarantula_id = Column(Integer, db.ForeignKey(add_prefix_for_prod("tarantulas.id")), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "tarantula_id": self.tarantula_id
        }
