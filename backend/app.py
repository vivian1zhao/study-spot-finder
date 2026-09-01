from flask import Flask
from controllers.places_reviews_controller import places_reviews_bp

app = Flask(__name__)

app.register_blueprint(places_reviews_bp, url_prefix="/")

if __name__ == "__main__":
    app.run(debug=True)
