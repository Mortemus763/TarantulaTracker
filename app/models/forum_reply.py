from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, ForeignKey, Text

class ForumReply(db.Model):
    __tablename__ = "forum_replies"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey(add_prefix_for_prod("forum_posts.id")), nullable=False)
    user_id = Column(Integer, ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(db.DateTime, default=datetime.utcnow)
    updated_at = Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    post = relationship("ForumPost", back_populates="replies")
    user = relationship("User", back_populates="forum_replies")

    def to_dict(self):
        return {
            "id": self.id,
            "post_id": self.post_id,
            "user_id": self.user_id,
            "content": self.content,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
