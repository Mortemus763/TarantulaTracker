from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, ForumReply, ForumPost

forum_replies_routes = Blueprint("forum_replies", __name__)

# GET all replies for a forum post
@forum_replies_routes.route("/forum/posts/<int:post_id>/replies", methods=["GET"])
def get_replies(post_id):
    """
    Get all replies for a specific forum post
    """
    post = ForumPost.query.get(post_id)

    if not post:
        return jsonify({"error": "Forum post not found"}), 404

    replies = ForumReply.query.filter_by(post_id=post_id).all()

    return jsonify({
        "replies": [reply.to_dict() for reply in replies]
    }), 200

# Create a new reply for a forum post
@forum_replies_routes.route("/forum/posts/<int:post_id>/replies", methods=["POST"])
@login_required
def create_reply(post_id):
    """
    Add a reply to a forum post
    """
    data = request.get_json()

    if "content" not in data:
        return jsonify({"error": "'content' is required"}), 400

    post = ForumPost.query.get(post_id)
    
    if not post:
        return jsonify({"error": "Forum post not found"}), 404

    new_reply = ForumReply(
        post_id=post_id,
        user_id=current_user.id,
        content=data["content"]
    )

    db.session.add(new_reply)
    db.session.commit()

    return jsonify({"message": "Reply added successfully!", "reply": new_reply.to_dict()}), 201

# Update an existing reply
@forum_replies_routes.route("/forum/replies/<int:reply_id>", methods=["PUT"])
@login_required
def update_reply(reply_id):
    """
    Update an existing reply (only if the current user is the owner)
    """
    reply = ForumReply.query.get(reply_id)

    if not reply:
        return jsonify({"error": "Reply not found"}), 404

    if reply.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()

    reply.content = data.get("content", reply.content)

    db.session.commit()

    return jsonify({"message": "Reply updated successfully!", "reply": reply.to_dict()}), 200

# Remove a reply from a forum post
@forum_replies_routes.route("/forum/replies/<int:reply_id>", methods=["DELETE"])
@login_required
def delete_reply(reply_id):
    """
    Delete a reply (only if the current user is the owner)
    """
    reply = ForumReply.query.get(reply_id)

    if not reply:
        return jsonify({"error": "Reply not found"}), 404

    if reply.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(reply)
    db.session.commit()

    return jsonify({"message": "Reply deleted successfully!"}), 200
