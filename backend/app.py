from flask import Flask
from controllers.places_reviews_controller import places_reviews_bp
from controllers.favs_placedetails_controller import favs_placedetails_bp

app = Flask(__name__)

app.register_blueprint(places_reviews_bp, url_prefix="/")
app.register_blueprint(favs_placedetails_bp, url_prefix="/")

if __name__ == "__main__":
    app.run(debug=True)
