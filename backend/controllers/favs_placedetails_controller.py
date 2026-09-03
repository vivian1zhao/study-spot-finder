from flask import Blueprint, jsonify
from audit_log_model import log_action

from models.favs_placedetails_model import (
    get_place_amenities,
    get_place_hours,
    get_user_favorites,
    add_favorite,
    remove_favorite,
    get_place_details
)

favs_placedetails_bp = Blueprint("favs_placedetails_bp", __name__)

@favs_placedetails_bp.route('/')
def home():
    return "Study spot finder is running!"

# returns all the amenities of a given place
@favs_placedetails_bp.route("/places/<int:place_id>/amenities", methods=['GET'])
def get_place_amenities_route(place_id):
    amenities = get_place_amenities(place_id)
    return jsonify(amenities)

# return opening hours of a given place
@favs_placedetails_bp.route("/places/<int:place_id>/hours", methods=['GET'])
def get_place_hours_route(place_id):
    hours = get_place_hours(place_id)
    return jsonify(hours)

# return a user's favorite study spots
@favs_placedetails_bp.route("/users/<int:user_id>/favorites", methods=['GET'])
def get_user_favorites_route(user_id):
    favorites = get_user_favorites(user_id)
    return jsonify(favorites)

# add new spot to user's favorites
@favs_placedetails_bp.route("/users/<int:user_id>/favorites/<int:place_id>", methods=['POST'])
def add_favorite_route(user_id, place_id):
    fav_id = add_favorite(user_id, place_id)

    if fav_id is None:
        return jsonify({
            "message": "Place is already in favorites"
        }), 409
        
    log_action(
        user_id,
        "INSERT",
        "Favorites",
        f"Place {place_id} added to favorites"
    )

    return jsonify({
        "message": "Favorite added",
        "favorite_id": fav_id
    }), 201

# remove a spot from user's favorites
@favs_placedetails_bp.route("/users/<int:user_id>/favorites/<int:place_id>", methods=['DELETE'])
def remove_favorite_route(user_id,place_id):
    rows_deleted = remove_favorite(user_id, place_id)

    if rows_deleted == 0:
        return jsonify({
            "message": "Favorite not found"
        }), 404
    

    return jsonify({
        "message": "Favorite removed",
    }), 200

# return full details of a place
@favs_placedetails_bp.route("/places/<int:place_id>/details", methods=['GET'])
def get_place_details_route(place_id):
    place = get_place_details(place_id)

    if place is None:
        return jsonify({
            "message": "Place is not found"
        }), 404

    return jsonify(place), 200

