import unittest
from unittest.mock import patch

from app import app


class PlacesReviewsControllerTests(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    @patch("controllers.places_reviews_controller.model.get_all_places")
    def test_get_all_places(self, mock_get_all_places):
        mock_get_all_places.return_value = [
            {"place_id": 1, "place_name": "Library"}
        ]

        response = self.client.get("/places")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), [
            {"place_id": 1, "place_name": "Library"}
        ])
        mock_get_all_places.assert_called_once_with()

    @patch("controllers.places_reviews_controller.model.search_places")
    def test_search_places_with_filters(self, mock_search_places):
        mock_search_places.return_value = [
            {"place_id": 4, "city": "Manalapan", "place_type": "Cafe"}
        ]

        response = self.client.get("/places/search?city=Manalapan&type=Cafe")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.get_json()), 1)
        mock_search_places.assert_called_once_with("Manalapan", "Cafe")

    @patch("controllers.places_reviews_controller.model.get_place_details")
    def test_get_place_details(self, mock_get_place_details):
        mock_get_place_details.return_value = {
            "place_id": 3,
            "place_name": "Campus Library"
        }

        response = self.client.get("/places/3")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["place_id"], 3)
        mock_get_place_details.assert_called_once_with(3)

    @patch("controllers.places_reviews_controller.model.log_action")
    @patch("controllers.places_reviews_controller.model.update_place_rating")
    @patch("controllers.places_reviews_controller.model.add_review")
    def test_add_review(self, mock_add_review, mock_update_rating, mock_log_action):
        review = {
            "place_id": 2,
            "user_id": 5,
            "overall_rating": 4,
            "noise": 3,
            "seating": 4,
            "outlets": 5,
            "wifi": 5,
            "food": 3,
            "opening_hours": 4,
            "parking": 2,
            "comments": "Good place to study"
        }

        response = self.client.post("/reviews/add", json=review)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json(), {"message": "Review added successfully"})
        mock_add_review.assert_called_once_with(review)
        mock_update_rating.assert_called_once_with(2)
        mock_log_action.assert_called_once_with(
            5,
            "INSERT",
            "Reviews",
            "Review added for place 2"
        )


if __name__ == "__main__":
    unittest.main()
