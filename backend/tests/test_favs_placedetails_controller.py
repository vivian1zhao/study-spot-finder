import unittest
from unittest.mock import patch

import models.favs_placedetails_model as favs_model
from app import app


class FavsPlaceDetailsControllerTests(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    def test_home(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_data(as_text=True), "Study spot finder is running!")

    @patch("controllers.favs_placedetails_controller.get_place_amenities")
    def test_get_place_amenities(self, mock_get_amenities):
        mock_get_amenities.return_value = [
            {"amenity_id": 1, "amenity_name": "Wi-Fi"}
        ]

        response = self.client.get("/places/2/amenities")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), [
            {"amenity_id": 1, "amenity_name": "Wi-Fi"}
        ])
        mock_get_amenities.assert_called_once_with(2)

    @patch("controllers.favs_placedetails_controller.get_place_hours")
    def test_get_place_hours(self, mock_get_hours):
        mock_get_hours.return_value = [
            {"day_of_week": "Monday", "open_time": "08:00:00", "close_time": "20:00:00"}
        ]

        response = self.client.get("/places/2/hours")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()[0]["day_of_week"], "Monday")
        mock_get_hours.assert_called_once_with(2)

    @patch("controllers.favs_placedetails_controller.get_user_favorites")
    def test_get_user_favorites(self, mock_get_favorites):
        mock_get_favorites.return_value = [
            {"favorite_id": 3, "place_id": 2, "place_name": "Test Cafe"}
        ]

        response = self.client.get("/users/5/favorites")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()[0]["favorite_id"], 3)
        mock_get_favorites.assert_called_once_with(5)

    @patch("controllers.favs_placedetails_controller.add_favorite")
    def test_add_favorite_success(self, mock_add_favorite):
        mock_add_favorite.return_value = 10

        response = self.client.post("/users/5/favorites/2")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json(), {
            "message": "Favorite added",
            "favorite_id": 10
        })
        mock_add_favorite.assert_called_once_with(5, 2)

    @patch("controllers.favs_placedetails_controller.add_favorite")
    def test_add_favorite_duplicate(self, mock_add_favorite):
        mock_add_favorite.return_value = None

        response = self.client.post("/users/5/favorites/2")

        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.get_json(), {
            "message": "Place is already in favorites"
        })

    @patch("controllers.favs_placedetails_controller.remove_favorite")
    def test_remove_favorite_success(self, mock_remove_favorite):
        mock_remove_favorite.return_value = 1

        response = self.client.delete("/users/5/favorites/2")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Favorite removed"})
        mock_remove_favorite.assert_called_once_with(5, 2)

    @patch("controllers.favs_placedetails_controller.remove_favorite")
    def test_remove_favorite_not_found(self, mock_remove_favorite):
        mock_remove_favorite.return_value = 0

        response = self.client.delete("/users/5/favorites/2")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"message": "Favorite not found"})

    @patch("controllers.favs_placedetails_controller.get_place_details")
    def test_get_place_details_success(self, mock_get_details):
        mock_get_details.return_value = {
            "place_id": 2,
            "place_name": "Test Cafe",
            "amenities": [],
            "opening_hours": [],
            "ratings": {},
            "reviews": []
        }

        response = self.client.get("/places/2/details")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["place_id"], 2)
        mock_get_details.assert_called_once_with(2)

    @patch("controllers.favs_placedetails_controller.get_place_details")
    def test_get_place_details_not_found(self, mock_get_details):
        mock_get_details.return_value = None

        response = self.client.get("/places/999/details")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"message": "Place is not found"})



class FavsPlaceDetailsModelLogicTests(unittest.TestCase):
    @patch("models.favs_placedetails_model.get_place_reviews")
    @patch("models.favs_placedetails_model.get_rating_summary")
    @patch("models.favs_placedetails_model.get_place_hours")
    @patch("models.favs_placedetails_model.get_place_amenities")
    @patch("models.favs_placedetails_model.get_place_by_id")
    def test_get_place_details_combines_all_sections(
        self,
        mock_get_place,
        mock_get_amenities,
        mock_get_hours,
        mock_get_ratings,
        mock_get_reviews,
    ):
        mock_get_place.return_value = {"place_id": 2, "place_name": "Test Cafe"}
        mock_get_amenities.return_value = [{"amenity_name": "Wi-Fi"}]
        mock_get_hours.return_value = [{"day_of_week": "Monday"}]
        mock_get_ratings.return_value = {"avg_rating": 4.5}
        mock_get_reviews.return_value = [{"review_id": 1}]

        result = favs_model.get_place_details(2)

        self.assertEqual(result["place_id"], 2)
        self.assertEqual(result["amenities"], [{"amenity_name": "Wi-Fi"}])
        self.assertEqual(result["opening_hours"], [{"day_of_week": "Monday"}])
        self.assertEqual(result["ratings"], {"avg_rating": 4.5})
        self.assertEqual(result["reviews"], [{"review_id": 1}])

    @patch("models.favs_placedetails_model.get_place_by_id")
    def test_get_place_details_returns_none_for_missing_place(self, mock_get_place):
        mock_get_place.return_value = None

        result = favs_model.get_place_details(999)

        self.assertIsNone(result)

    @patch("models.favs_placedetails_model.get_db")
    @patch("models.favs_placedetails_model.favorite_exists")
    def test_add_favorite_does_not_insert_duplicate(self, mock_favorite_exists, mock_get_db):
        mock_favorite_exists.return_value = True

        result = favs_model.add_favorite(5, 2)

        self.assertIsNone(result)
        mock_get_db.assert_not_called()


if __name__ == "__main__":
    unittest.main()
