from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, ForeignKey, Table

forum_post_tags = db.Table(
    "forum_post_tags",
    db.Column("post_id", Integer, db.ForeignKey(add_prefix_for_prod("forum_posts.id")), primary_key=True),
    db.Column("tag_id", Integer, db.ForeignKey(add_prefix_for_prod("tags.id")), primary_key=True)
)

if environment == "production":
    forum_post_tags.schema = SCHEMA
