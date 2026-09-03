from functools import wraps

from flask import Blueprint, jsonify, request

from audit_log_model import log_action
import models.login_register_admin_model as model

users_bp = Blueprint("users", __name__)


# Gate for admin-only routes: checks the X-user-role header set by the
# frontend after requireAdminAction()/requireAdminPage() confirm the
# logged-in user's role.
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # FIX: this was previously written as a single line —
        # `role = request.headers.get("X-user-role") if role != "admin":`
        # — which references `role` before it's assigned and isn't valid
        # Python (an `if` can't trail a variable assignment like that).
        # Split into its own statement + a real `if` block below.
        role = request.headers.get("X-user-role")
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
        log_action(
            user["user_id"],
            "LOGIN_SUCCESS",
            "Users",
            "User logged in successfully"
        )
        return jsonify({
            "message": "Login successful",
            "user_id": user["user_id"],
            "fname": user["fname"],
            "lname": user["lname"],
            "user_role": user["user_role"]
        }), 200

    log_action(
        None,
        "LOGIN_FAILED",
        "Users",
        f"Failed login attempt for username {username}",
        username=username
    )
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

    log_action(
        new_id,
        "INSERT",
        "Users",
        "New user account created"
    )
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
    log_action(
        data.get("user_id"),
        "INSERT",
        "Places",
        f"Place {place_id} added"
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

    log_action(
        data.get("user_id"),
        "UPDATE",
        "Places",
        f"Place {place_id} updated"
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

    log_action(
        request.json.get("user_id"),
        "DELETE",
        "Places",
        f"Place {place_id} deleted"
    )
    return jsonify({"message": "Place deleted"}), 200


# ------------------ ADMIN: USERS ------------------
@users_bp.get("/admin/users/search")
@admin_required
def search_users():
    query = request.args.get("q", "").strip()
    if not query:
        return jsonify([]), 200
    users = model.search_users(query)
    return jsonify(users), 200


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
    log_action(
        data.get("user_id"),
        "UPDATE",
        "Users",
        f"User {target_id} updated"
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

    log_action(
        request.json.get("user_id"),
        "DELETE",
        "Users",
        f"User {target_id} deleted"
    )
    return jsonify({"message": "User deleted"}), 200