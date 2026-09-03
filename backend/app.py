from flask import Flask
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics

from controllers.places_reviews_controller import places_reviews_bp
from controllers.favs_placedetails_controller import favs_placedetails_bp
from controllers.login_register_admin_controllers import users_bp
app = Flask(__name__)
CORS(app)

metrics = PrometheusMetrics(app)

app.register_blueprint(places_reviews_bp, url_prefix="/")
app.register_blueprint(favs_placedetails_bp, url_prefix="/")
app.register_blueprint(users_bp, url_prefix="/")

# test grafana error monitoring
@app.get("/test-error")
def test_error():
    return {"message": "Test error"}, 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
