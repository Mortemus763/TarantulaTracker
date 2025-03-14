from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, ForumPost

forum_routes = Blueprint("forums", __name__)

# GET all forum posts
@forum_routes.route("/", methods=["GET"])
def get_forum_posts():
    """
    Get all forum posts
    """
    forum_posts = ForumPost.query.all()
    return jsonify({"forumPosts": [post.to_dict() for post in forum_posts]}), 200


# Create a new forum post
@forum_routes.route("/", methods=["POST"])
@login_required
def create_forum_post():
    """
    Create a new forum post
    """
    data = request.get_json()

    # Validate request body
    required_fields = ["title", "content"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"'{field}' is required"}), 400

    # Create new forum post
    new_post = ForumPost(
        user_id=current_user.id,
        title=data["title"],
        content=data["content"]
    )

    db.session.add(new_post)
    db.session.commit()

    return jsonify({"message": "Forum post created successfully!", "forumPost": new_post.to_dict()}), 201

# Update an existing forum post
@forum_routes.route("/<int:post_id>", methods=["PUT"])
@login_required
def update_forum_post(post_id):
    """
    Update an existing forum post
    """
    post = ForumPost.query.get(post_id)

    if not post:
        return jsonify({"error": "Forum post not found"}), 404

    if post.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()

    # Update forum post details
    post.title = data.get("title", post.title)
    post.content = data.get("content", post.content)

    db.session.commit()

    return jsonify({"message": "Forum post updated successfully!", "forumPost": post.to_dict()}), 200

# Remove a forum post
@forum_routes.route("/<int:post_id>", methods=["DELETE"])
@login_required
def delete_forum_post(post_id):
    """
    Delete a forum post
    """
    post = ForumPost.query.get(post_id)

    if not post:
        return jsonify({"error": "Forum post not found"}), 404

    if post.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(post)
    db.session.commit()

    return jsonify({"message": "Forum post deleted successfully!"}), 200
