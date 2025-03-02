from flask.cli import AppGroup
from .users import seed_users, undo_users
from .tarantulas import seed_tarantulas, undo_tarantulas
from .forum_posts import seed_forum_posts, undo_forum_posts
from .favorites import seed_favorites, undo_favorites
from .tags import seed_tags, undo_tags
from .forum_post_tags import seed_forum_post_tags, undo_forum_post_tags
from .forum_replies import seed_forum_replies, undo_forum_replies


from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_tarantulas()
        undo_forum_posts()
        undo_favorites()
        undo_tags()
        undo_forum_post_tags()
        undo_forum_replies()
    seed_users()
    seed_tarantulas()
    seed_forum_posts()
    seed_favorites()
    seed_tags()
    seed_forum_post_tags()
    seed_forum_replies()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_tarantulas()
    undo_forum_posts()
    undo_favorites()
    undo_tags()
    undo_forum_post_tags()
    undo_forum_replies()
    # Add other undo functions here
