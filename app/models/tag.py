from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Tag(db.Model):
    __tablename__ = "tags"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False)

    # Relationship to Forum Posts (Many-to-Many)
    forum_posts = relationship("ForumPost", secondary="forum_post_tags", back_populates="tags")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }
