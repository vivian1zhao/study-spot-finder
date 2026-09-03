from flask import Flask
from flask_cors import CORS
from controllers.places_reviews_controller import places_reviews_bp
from controllers.favs_placedetails_controller import favs_placedetails_bp
from controllers.login_register_admin_controllers import users_bp
app = Flask(__name__)
CORS(app)

app.register_blueprint(places_reviews_bp, url_prefix="/")
app.register_blueprint(favs_placedetails_bp, url_prefix="/")
app.register_blueprint(users_bp, url_prefix="/")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
