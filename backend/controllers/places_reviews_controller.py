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
    model.log_action(
        data["user_id"],
        "INSERT",
        "Reviews",
        f"Review added for place {data['place_id']}"
    )

    return jsonify({"message": "Review added successfully"}), 201

@places_reviews_bp.get("/users/<int:user_id>/reviews")
def get_user_reviews(user_id):
    reviews = model.get_user_reviews(user_id)
    return jsonify(reviews), 200

@places_reviews_bp.put("/users/<int:user_id>/reviews/<int:review_id>")
def edit_review(user_id, review_id):
    data = request.json

    place_id = model.update_review(
        user_id,
        review_id,
        data
    )

    if place_id is None:
        return jsonify({
            "message": "Review not found"
        }), 404

    model.update_place_rating(place_id)

    return jsonify({
        "message": "Review updated successfully"
    }), 200

@places_reviews_bp.delete("/users/<int:user_id>/reviews/<int:review_id>")
def delete_review(user_id, review_id):
    place_id = model.delete_review(
        user_id,
        review_id
    )

    if place_id is None:
        return jsonify({
            "message": "Review not found"
        }), 404

    model.update_place_rating(place_id)

    return jsonify({
        "message": "Review deleted successfully"
    }), 200