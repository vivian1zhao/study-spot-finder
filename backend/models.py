from database import get_connection

#================
# AMENITIES
#================

def get_place_amenities(place_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT a.amenity_id, a.amenity_name
        FROM Amenities a
        JOIN PlaceAmenities pa 
            ON a.amenity_id = pa.amenity_id
        WHERE pa.place_id = %s
    """

    cursor.execute(query, (place_id,))
    amenities = cursor.fetchall()

    cursor.close()
    connection.close()

    return amenities

#====================
# OPENING HOURS
#====================

def get_place_hours(place_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT hours_id, place_id, 
            day_of_week, open_time, close_time, is_24_hours, closed
        FROM OpeningHours 
        WHERE place_id = %s
        ORDER BY day_of_week
    """

    cursor.execute(query, (place_id,))
    hours = cursor.fetchall()

    cursor.close()
    connection.close()

    # convert time values to strings for json compatible formatting
    for row in hours:
        if row['open_time'] is not None:
            row['open_time'] = str(row['open_time'])
        if row['close_time'] is not None:
            row['close_time'] = str(row['close_time'])

    return hours

#=================
# FAVORITES
#=================

def get_user_favorites(user_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT f.favorite_id, p.place_id, p.place_name, 
            p.place_type, p.address, p.city, p.state
        FROM Favorites f
        JOIN Places p 
            ON f.place_id = p.place_id
        WHERE f.user_id = %s
    """

    cursor.execute(query, (user_id,))
    favorites = cursor.fetchall()

    cursor.close()
    connection.close()

    return favorites

def favorite_exists(user_id, place_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
            SELECT favorite_id
            FROM Favorites
            WHERE user_id = %s
              AND place_id = %s \
            """

    cursor.execute(query, (user_id, place_id))
    favorite = cursor.fetchone()

    cursor.close()
    connection.close()

    return favorite is not None

def add_favorite(user_id, place_id):
    # prevent duplicates of favorites
    if favorite_exists(user_id, place_id):
        return None

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        INSERT INTO Favorites (user_id, place_id)
        VALUES (%s, %s)
    """

    cursor.execute(query, (user_id,place_id))
    connection.commit()

    new_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return new_id

def remove_favorite(user_id, place_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        DELETE FROM Favorites 
        WHERE user_id = %s 
            AND place_id = %s
    """

    cursor.execute(query, (user_id, place_id))
    connection.commit()

    rows_deleted = cursor.rowcount

    cursor.close()
    connection.close()

    return rows_deleted

#=====================
# PLACE DETAILS
#=====================

def get_place_by_id(place_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT place_id, place_name, 
            place_type,address, city, state
        FROM Places
        WHERE place_id = %s
    """

    cursor.execute(query, (place_id,))
    place = cursor.fetchone()

    cursor.close()
    connection.close()

    return place

def get_rating_summary(place_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT 
            COUNT(review_id) AS total_reviews,
            ROUND(AVG(overall_rating),2) AS avg_rating,
            ROUND(AVG(noise), 2) AS avg_noise, 
            ROUND(AVG(seating), 2) AS avg_seating, 
            ROUND(AVG(outlets), 2) AS avg_outlets, 
            ROUND(AVG(wifi), 2) AS avg_wifi, 
            ROUND(AVG(food), 2) AS avg_food, 
            ROUND(AVG(opening_hours), 2) AS avg_hours,
            ROUND(AVG(parking), 2) AS avg_parking    
        FROM Reviews 
        WHERE place_id = %s
    """

    cursor.execute(query, (place_id,))
    ratings = cursor.fetchone()

    cursor.close()
    connection.close()

    return ratings

def get_place_reviews(place_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT r.review_id, r.user_id, u.fname, u.lname, 
            r.overall_rating, r.noise, r.seating, r.outlets,
            r.wifi, r.food, r.opening_hours, r.parking, r.comments
        FROM Reviews r
        JOIN Users u
            ON r.user_id = u.user_id
        WHERE r.place_id = %s
    """

    cursor.execute(query, (place_id,))
    reviews = cursor.fetchall()

    cursor.close()
    connection.close()

    return reviews

# combine everything together for one place
def get_place_details(place_id):
    place = get_place_by_id(place_id)

    if place is None:
        return None

    place['amenities'] = get_place_amenities(place_id)
    place['opening_hours'] = get_place_hours(place_id)
    place['ratings'] = get_rating_summary(place_id)
    place['reviews'] = get_place_reviews(place_id)

    return place
