from flask import Flask, make_response, request
from controllers.places_reviews_controller import places_reviews_bp
from controllers.favs_placedetails_controller import favs_placedetails_bp
from controllers.login_register_admin_controllers import users_bp
app = Flask(__name__)

app.register_blueprint(places_reviews_bp, url_prefix="/")
app.register_blueprint(favs_placedetails_bp, url_prefix="/")
app.register_blueprint(users_bp, url_prefix="/")


def _cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


@app.before_request
def handle_cors_preflight():
    if request.method == "OPTIONS":
        return _cors_headers(make_response("", 204))


@app.after_request
def add_cors_headers(response):
    return _cors_headers(response)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
