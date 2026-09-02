from config.db import get_db
from audit_log_model import log_action


# ------------------ PLACES ------------------

def get_all_places():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Places")
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results


def search_places(city=None, spot_type=None):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    query = "SELECT * FROM Places WHERE 1=1"
    params = []

    if city:
        query += " AND city = %s"
        params.append(city)

    if spot_type:
        query += " AND place_type = %s"
        params.append(spot_type)

    cursor.execute(query, params)
    results = cursor.fetchall()

    cursor.close()
    db.close()
    return results


def get_place_details(place_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Places WHERE place_id = %s", (place_id,))
    result = cursor.fetchone()
    cursor.close()
    db.close()
    return result


# ------------------ REVIEWS ------------------

def add_review(data):
    db = get_db()
    cursor = db.cursor()

    query = """
        INSERT INTO Reviews (
            place_id, user_id, overall_rating, noise, seating, outlets,
            wifi, food, opening_hours, parking, comments
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    params = (
        data["place_id"],
        data["user_id"],
        data["overall_rating"],
        data["noise"],
        data["seating"],
        data["outlets"],
        data["wifi"],
        data["food"],
        data["opening_hours"],
        data["parking"],
        data["comments"]
    )

    cursor.execute(query, params)
    db.commit()
    
    log_action(
        user_id=data["user_id"],
        action="INSERT",
        table_name="Reviews",
        details=f"Review added for place {data['place_id']}"
    )

    cursor.close()
    db.close()

def get_user_reviews(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    query = """
        SELECT
            r.review_id,
            r.place_id,
            r.user_id,
            p.place_name,
            r.overall_rating,
            r.noise,
            r.seating,
            r.outlets,
            r.wifi,
            r.food,
            r.opening_hours,
            r.parking,
            r.comments
        FROM Reviews r
        JOIN Places p
            ON r.place_id = p.place_id
        WHERE r.user_id = %s
    """

    cursor.execute(query, (user_id,))
    reviews = cursor.fetchall()

    cursor.close()
    db.close()

    return reviews

def update_review(user_id, review_id, data):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Get place_id first so we can update its average later
    cursor.execute("""
        SELECT place_id
        FROM Reviews
        WHERE review_id = %s
          AND user_id = %s
    """, (review_id, user_id))

    review = cursor.fetchone()

    if review is None:
        cursor.close()
        db.close()
        return None

    place_id = review["place_id"]

    cursor.execute("""
        UPDATE Reviews
        SET overall_rating = %s,
            noise = %s,
            seating = %s,
            outlets = %s,
            wifi = %s,
            food = %s,
            opening_hours = %s,
            parking = %s,
            comments = %s
        WHERE review_id = %s
          AND user_id = %s
    """, (
        data.get("overall_rating"),
        data.get("noise"),
        data.get("seating"),
        data.get("outlets"),
        data.get("wifi"),
        data.get("food"),
        data.get("opening_hours"),
        data.get("parking"),
        data.get("comments"),
        review_id,
        user_id
    ))

    db.commit()

    cursor.close()
    db.close()

    return place_id

def delete_review(user_id, review_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT place_id
        FROM Reviews
        WHERE review_id = %s
          AND user_id = %s
    """, (review_id, user_id))

    review = cursor.fetchone()

    if review is None:
        cursor.close()
        db.close()
        return None

    place_id = review["place_id"]

    cursor.execute("""
        DELETE FROM Reviews
        WHERE review_id = %s
          AND user_id = %s
    """, (review_id, user_id))

    db.commit()

    cursor.close()
    db.close()

    return place_id


# ------------------ review trigger logic / RATING UPDATE ------------------

def update_place_rating(place_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT COUNT(*) AS total_reviews,
               AVG(overall_rating) AS avg_rating
        FROM Reviews
        WHERE place_id = %s
    """, (place_id,))

    stats = cursor.fetchone()

    cursor.execute("""
        UPDATE Places
        SET total_reviews = %s,
            avg_rating = %s
        WHERE place_id = %s
    """, (stats["total_reviews"], stats["avg_rating"], place_id))

    db.commit()
    cursor.close()
    db.close()



