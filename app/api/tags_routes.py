from flask import Blueprint, request, jsonify
from flask_login import login_required
from app.models import db, Tag, forum_post_tags, ForumPost

tags_routes = Blueprint("tags", __name__)

# GET all available tags
@tags_routes.route("/", methods=["GET"])
def get_tags():
    """
    Retrieve all available tags
    """
    tags = Tag.query.all()
    return jsonify({
        "tags": [tag.to_dict() for tag in tags]
    }), 200

# Add a Tag to a Forum Post
@tags_routes.route("/forum/posts/<int:post_id>/tags", methods=["POST"])
@login_required
def add_tag_to_post(post_id):
    """
    Add a tag to a forum post
    """
    data = request.get_json()

    if "tag_id" not in data:
        return jsonify({"error": "'tag_id' is required"}), 400

    tag = Tag.query.get(data["tag_id"])
    if not tag:
        return jsonify({"error": "Tag not found"}), 404

    post = ForumPost.query.get(post_id)
    if not post:
        return jsonify({"error": "Forum post not found"}), 404

    # Check if tag is already associated with the post
    exists = db.session.execute(
        db.select(forum_post_tags).where(
            (forum_post_tags.c.post_id == post_id) &
            (forum_post_tags.c.tag_id == data["tag_id"])
        )
    ).fetchone()

    if exists:
        return jsonify({"error": "Tag already added to the post"}), 400

    # Insert into join table
    insert_stmt = forum_post_tags.insert().values(
        post_id=post_id,
        tag_id=data["tag_id"]
    )

    db.session.execute(insert_stmt)
    db.session.commit()

    return jsonify({"message": "Tag added to post successfully!"}), 201

# Remove a Tag from a Forum Post
@tags_routes.route("/forum/posts/<int:post_id>/tags/<int:tag_id>", methods=["DELETE"])
@login_required
def remove_tag_from_post(post_id, tag_id):
    """
    Remove a tag from a forum post
    """
    delete_stmt = forum_post_tags.delete().where(
        (forum_post_tags.c.post_id == post_id) &
        (forum_post_tags.c.tag_id == tag_id)
    )

    result = db.session.execute(delete_stmt)

    if result.rowcount == 0:
        return jsonify({"error": "Tag not found on this post"}), 404

    db.session.commit()

    return jsonify({"message": "Tag removed from post successfully!"}), 200
