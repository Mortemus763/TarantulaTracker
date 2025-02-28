from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, ForeignKey, Table

favorites = db.Table(
    "favorites",
    db.Column("user_id", Integer, ForeignKey(add_prefix_for_prod("users.id")), primary_key=True),
    db.Column("tarantula_id", Integer, ForeignKey(add_prefix_for_prod("tarantulas.id")), primary_key=True)
)

if environment == "production":
    favorites.schema = SCHEMA
