from flask import Blueprint, jsonify, request
import models.places_reviews_model as model

places_reviews_bp = Blueprint("places_reviews", __name__)

# ------------------ PLACES ------------------

@places_reviews_bp.get("/places")
def get_places():
    return jsonify(model.get_all_places())


@places_reviews_bp.get("/places/search")
def search_places():
    city = request.args.get("city")
    spot_type = request.args.get("type")
    return jsonify(model.search_places(city, spot_type))


@places_reviews_bp.get("/places/<int:place_id>")
def place_details(place_id):
    return jsonify(model.get_place_details(place_id))


# ------------------ REVIEWS ------------------

@places_reviews_bp.post("/reviews/add")
def add_review():
    data = request.json

    model.add_review(data)
    model.update_place_rating(data["place_id"])
    

    return jsonify({"message": "Review added successfully"}), 201
