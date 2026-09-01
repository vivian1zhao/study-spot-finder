import unittest
from unittest.mock import patch

from app import app


class LoginRegisterAdminControllerTests(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    @patch("controllers.login_register_admin_controllers.model.get_user_by_credentials")
    def test_login_success(self, mock_get_user):
        mock_get_user.return_value = {"user_id": 7, "username": "testuser"}

        response = self.client.post("/login", json={
            "username": "testuser",
            "pass_word": "password123"
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {
            "message": "Login successful",
            "user_id": 7
        })
        mock_get_user.assert_called_once_with("testuser", "password123")

    @patch("controllers.login_register_admin_controllers.model.get_user_by_credentials")
    def test_login_invalid_credentials(self, mock_get_user):
        mock_get_user.return_value = None

        response = self.client.post("/login", json={
            "username": "wrong",
            "pass_word": "wrong"
        })

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.get_json(), {
            "message": "Invalid username and/or password"
        })

    @patch("controllers.login_register_admin_controllers.model.username_exists")
    def test_register_duplicate_username(self, mock_username_exists):
        mock_username_exists.return_value = True

        response = self.client.post("/register", json={"username": "existing"})

        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.get_json(), {"message": "Username already taken"})

    @patch("controllers.login_register_admin_controllers.model.create_user")
    @patch("controllers.login_register_admin_controllers.model.username_exists")
    def test_register_success(self, mock_username_exists, mock_create_user):
        mock_username_exists.return_value = False
        mock_create_user.return_value = 11

        payload = {
            "fname": "Test",
            "lname": "User",
            "pass_word": "password123",
            "email": "test@example.com",
            "phone": "555-111-2222",
            "address": "1 Main St",
            "city": "Test City",
            "state": "NJ",
            "username": "newuser"
        }

        response = self.client.post("/register", json=payload)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json()["message"], "Record added")
        self.assertEqual(response.get_json()["record"]["user_id"], 11)
        self.assertNotIn("pass_word", response.get_json()["record"])
        mock_create_user.assert_called_once_with(
            "Test", "User", "password123", "test@example.com",
            "555-111-2222", "1 Main St", "Test City", "NJ", "newuser"
        )

    @patch("controllers.login_register_admin_controllers.model.add_place")
    def test_admin_add_place(self, mock_add_place):
        mock_add_place.return_value = 15

        response = self.client.post("/admin/places", json={
            "user_role": "admin",
            "place_name": "New Library",
            "place_type": "Library",
            "address": "10 Main St",
            "city": "Test City",
            "state": "NJ"
        })

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json(), {
            "message": "Place added",
            "place_id": 15
        })

    @patch("controllers.login_register_admin_controllers.model.add_place")
    def test_non_admin_cannot_add_place(self, mock_add_place):
        response = self.client.post("/admin/places", json={
            "user_role": "user",
            "place_name": "New Library"
        })

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.get_json(), {"message": "Admin access required"})
        mock_add_place.assert_not_called()

    @patch("controllers.login_register_admin_controllers.model.update_place")
    def test_admin_edit_place_not_found(self, mock_update_place):
        mock_update_place.return_value = 0

        response = self.client.put("/admin/places/999", json={
            "user_role": "admin",
            "place_name": "Missing",
            "place_type": "Cafe",
            "address": "",
            "city": "",
            "state": "NJ"
        })

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"message": "Place not found"})

    @patch("controllers.login_register_admin_controllers.model.delete_place")
    def test_admin_delete_place_success(self, mock_delete_place):
        mock_delete_place.return_value = 1

        response = self.client.delete("/admin/places/3", json={
            "user_role": "admin"
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Place deleted"})
        mock_delete_place.assert_called_once_with(3)

    @patch("controllers.login_register_admin_controllers.model.update_user")
    def test_admin_edit_user_success(self, mock_update_user):
        mock_update_user.return_value = 1

        response = self.client.put("/admin/users/8", json={
            "user_role": "admin",
            "fname": "Updated",
            "lname": "User",
            "email": "updated@example.com"
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "User updated"})

    @patch("controllers.login_register_admin_controllers.model.delete_user")
    def test_admin_delete_user_not_found(self, mock_delete_user):
        mock_delete_user.return_value = 0

        response = self.client.delete("/admin/users/999", json={
            "user_role": "admin"
        })

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"message": "User not found"})


if __name__ == "__main__":
    unittest.main()
