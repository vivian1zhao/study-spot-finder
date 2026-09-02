from functools import wraps

from flask import Blueprint, jsonify, request

import models.login_register_admin_model as model

users_bp = Blueprint("users", __name__)


# function to trigger the admin routes by seeing if the user is an admin via user_role
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data = request.json
        role = data.get("user_role")

        if role != "admin":
            return jsonify({"message": "Admin access required"}), 403

        return f(*args, **kwargs)
    return decorated_function


# ------------------ AUTH ------------------

@users_bp.post("/login")
def login():
    data = request.json
    username = data.get("username")
    password = data.get("pass_word")

    user = model.get_user_by_credentials(username, password)

    if user:
        return jsonify({
            "message": "Login successful",
            "user_id": user["user_id"],
            "fname": user["fname"],
            "lname": user["lname"]
        }), 200

    return jsonify({"message": "Invalid username and/or password"}), 401


@users_bp.post("/register")
def newuser():
    data = request.json

    if model.username_exists(data["username"]):
        return jsonify({"message": "Username already taken"}), 409

    new_id = model.create_user(
        data.get("fname"),
        data.get("lname"),
        data.get("pass_word"),
        data.get("email"),
        data.get("phone"),
        data.get("address"),
        data.get("city"),
        data.get("state"),
        data.get("username")
    )

    new_record = {
        "user_id": new_id,
        "fname": data.get("fname"),
        "lname": data.get("lname"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "address": data.get("address"),
        "city": data.get("city"),
        "state": data.get("state"),
        "username": data.get("username")
    }

    return jsonify({"record": new_record, "message": "Record added"}), 201

@users_bp.get("/users/<int:user_id>")
def get_user(user_id):
    user = model.get_user_by_id(user_id)

    if user is None:
        return jsonify({
            "message": "User not found"
        }), 404

    return jsonify(user), 200


# ------------------ ADMIN: PLACES ------------------

@users_bp.post("/admin/places")
@admin_required
def add_place():
    data = request.json

    place_id = model.add_place(
        data.get("place_name"),
        data.get("place_type"),
        data.get("address"),
        data.get("city"),
        data.get("state")
    )

    return jsonify({"message": "Place added", "place_id": place_id}), 201


@users_bp.put("/admin/places/<int:place_id>")
@admin_required
def edit_place(place_id):
    data = request.json

    rows_updated = model.update_place(
        place_id,
        data.get("place_name"),
        data.get("place_type"),
        data.get("address"),
        data.get("city"),
        data.get("state")
    )

    if rows_updated == 0:
        return jsonify({"message": "Place not found"}), 404

    return jsonify({"message": "Place updated"}), 200


@users_bp.delete("/admin/places/<int:place_id>")
@admin_required
def delete_place(place_id):
    rows_deleted = model.delete_place(place_id)

    if rows_deleted == 0:
        return jsonify({"message": "Place not found"}), 404

    return jsonify({"message": "Place deleted"}), 200


# ------------------ ADMIN: USERS ------------------

@users_bp.put("/admin/users/<int:target_id>")
@admin_required
def edit_user(target_id):
    data = request.json

    rows_updated = model.update_user(
        target_id,
        data.get("fname"),
        data.get("lname"),
        data.get("email"),
        data.get("user_role")
    )

    if rows_updated == 0:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"message": "User updated"}), 200


@users_bp.delete("/admin/users/<int:target_id>")
@admin_required
def delete_user(target_id):
    rows_deleted = model.delete_user(target_id)

    if rows_deleted == 0:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"message": "User deleted"}), 200