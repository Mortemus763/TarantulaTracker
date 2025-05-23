from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Favorite, Tarantula

favorites_routes = Blueprint("favorites", __name__)

# GET all favorite tarantulas of the logged-in user
@favorites_routes.route("/", methods=["GET"])
@login_required
def get_favorites():
    """
    Get all favorite tarantulas of the authenticated user
    """
    tarantulas = (
        db.session.query(Tarantula)
        .join(Favorite, Favorite.tarantula_id == Tarantula.id)
        .filter(Favorite.user_id == current_user.id)
        .all()
    )

    return jsonify({
        "favorites": [tarantula.to_dict() for tarantula in tarantulas]
    }), 200


# Add a tarantula to the user's favorites
@favorites_routes.route("/", methods=["POST"])
@login_required
def add_favorite():
    """
    Add a tarantula to the authenticated user's favorites list
    """
    data = request.get_json()

    if "tarantula_id" not in data:
        return jsonify({"error": "'tarantula_id' is required"}), 400

    tarantula = Tarantula.query.get(data["tarantula_id"])

    if not tarantula:
        return jsonify({"error": "Tarantula not found"}), 404

    # Check if the tarantula is already in favorites
    existing_favorite = Favorite.query.filter_by(
        user_id=current_user.id, tarantula_id=data["tarantula_id"]
    ).first()

    if existing_favorite:
        return jsonify({"error": "Tarantula already in favorites"}), 400

    # Create a new Favorite instance and commit it
    new_favorite = Favorite(user_id=current_user.id, tarantula_id=data["tarantula_id"])
    db.session.add(new_favorite)
    db.session.commit()

    return jsonify({"message": "Tarantula added to favorites successfully!"}), 201


# Remove a tarantula from the user's favorites
@favorites_routes.route("/<int:tarantula_id>", methods=["DELETE"])
@login_required
def remove_favorite(tarantula_id):
    """
    Remove a tarantula from the authenticated user's favorites list
    """
    favorite = Favorite.query.filter_by(
        user_id=current_user.id, tarantula_id=tarantula_id
    ).first()

    if not favorite:
        return jsonify({"error": "Tarantula not found in favorites"}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({"message": "Tarantula removed from favorites successfully!"}), 200
