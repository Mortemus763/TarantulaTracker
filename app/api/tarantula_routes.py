from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Tarantula

tarantula_routes = Blueprint("tarantulas", __name__)

# GET all tarantulas 
@tarantula_routes.route("/", methods=["GET"])
@login_required
def get_tarantulas():
    """
    Get all tarantulas owned by the authenticated user
    """
    tarantulas = Tarantula.query.filter_by(user_id=current_user.id).all()
    return jsonify({"tarantulas": [tarantula.to_dict() for tarantula in tarantulas]}), 200


# Add a new tarantula to the user's collection
@tarantula_routes.route("/", methods=["POST"])
@login_required
def add_tarantula():
    """
    Add a new tarantula to the authenticated user's collection
    """
    try:
        data = request.get_json()
        print("Received Data:", data)  # Debugging log

        if not data:
            return jsonify({"error": "Invalid request, no data received"}), 400

        if "species" not in data or not data["species"].strip():
            return jsonify({"error": "'species' is required"}), 400

        # Ensure 'age' is properly handled
        age = data.get("age")
        if age is not None:
            try:
                age = int(age)  # Ensure age is an integer
            except ValueError:
                return jsonify({"error": "'age' must be a number"}), 400

        # Create new tarantula
        new_tarantula = Tarantula(
            user_id=current_user.id,
            species=data["species"],
            name=data.get("name"),
            age=age,  # Include the optional age field
            description=data.get("description"),
            location=data.get("location"),
            image=data.get("image"),
        )

        db.session.add(new_tarantula)
        db.session.commit()

        return jsonify({
            "message": "Tarantula added successfully!",
            "tarantula": new_tarantula.to_dict()
        }), 201

    except Exception as e:
        print(f"💥 ERROR: {str(e)}")
        return jsonify({"error": "Something went wrong on the server", "details": str(e)}), 500

# Update an existing tarantula by ID
@tarantula_routes.route("/<int:tarantula_id>", methods=["PUT"])
@login_required
def update_tarantula(tarantula_id):
    """
    Update an existing tarantula owned by the user
    """
    tarantula = Tarantula.query.get(tarantula_id)

    if not tarantula:
        return jsonify({"error": "Tarantula not found"}), 404

    if tarantula.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()

    # Update tarantula details
    tarantula.name = data.get("name", tarantula.name)
    tarantula.species = data.get("species", tarantula.species)
    tarantula.age = data.get("age", tarantula.age)
    tarantula.description = data.get("description", tarantula.description)

    db.session.commit()

    return jsonify({"message": "Tarantula updated successfully!", "tarantula": tarantula.to_dict()}), 200

# Remove a tarantula from the collection
@tarantula_routes.route("/<int:tarantula_id>", methods=["DELETE"])
@login_required
def delete_tarantula(tarantula_id):
    """
    Delete a tarantula owned by the user
    """
    tarantula = Tarantula.query.get(tarantula_id)

    if not tarantula:
        return jsonify({"error": "Tarantula not found"}), 404

    if tarantula.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(tarantula)
    db.session.commit()

    return jsonify({"message": "Tarantula deleted successfully!"}), 200
