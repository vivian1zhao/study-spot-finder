from config.db import get_db


# AUTH
def get_user_by_credentials(username, password):
    connection = get_db()
    cursor = connection.cursor(dictionary=True)
    query = """
    SELECT user_id, username, fname, lname, user_role
    FROM Users
    WHERE username = %s
    AND pass_word = %s
    """
    cursor.execute(query, (username, password))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    return user


def get_user_by_id(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    query = """
    SELECT user_id, fname, lname, username, email, city, state
    FROM Users
    WHERE user_id = %s
    """
    cursor.execute(query, (user_id,))
    user = cursor.fetchone()
    cursor.close()
    db.close()
    return user


# REGISTRATION
def username_exists(username):
    connection = get_db()
    cursor = connection.cursor(dictionary=True)
    query = """
    SELECT user_id
    FROM Users
    WHERE username = %s
    """
    cursor.execute(query, (username,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    return user is not None


def create_user(fname, lname, pword, email, ph_num, address, city, state, uname):
    connection = get_db()
    cursor = connection.cursor()
    query = """
    INSERT INTO Users
    (fname, lname, pass_word, email, phone, address, city, state, username)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (fname, lname, pword, email, ph_num, address, city, state, uname))
    connection.commit()
    new_id = cursor.lastrowid
    cursor.close()
    connection.close()
    return new_id


# ADMIN: USERS
def search_users(query):
    connection = get_db()
    cursor = connection.cursor(dictionary=True)
    like_query = f"%{query}%"
    sql = """
    SELECT user_id, fname, lname, username, email, city, state, user_role
    FROM Users
    WHERE username LIKE %s
    OR fname LIKE %s
    OR lname LIKE %s
    OR CONCAT(fname, ' ', lname) LIKE %s
    ORDER BY lname, fname
    """
    cursor.execute(sql, (like_query, like_query, like_query, like_query))
    users = cursor.fetchall()
    cursor.close()
    connection.close()
    return users


def update_user(target_id, fname, lname, email, user_role):
    connection = get_db()
    cursor = connection.cursor()
    query = """
    UPDATE Users
    SET fname = %s, lname = %s, email = %s, user_role = %s
    WHERE user_id = %s
    """
    cursor.execute(query, (fname, lname, email, user_role, target_id))
    connection.commit()
    rows_updated = cursor.rowcount
    cursor.close()
    connection.close()
    return rows_updated


def delete_user(target_id):
    connection = get_db()
    cursor = connection.cursor()
    # Delete child rows first (no ON DELETE CASCADE in the schema)
    cursor.execute("DELETE FROM Reviews WHERE user_id = %s", (target_id,))
    cursor.execute("DELETE FROM Favorites WHERE user_id = %s", (target_id,))
    cursor.execute("DELETE FROM Audit_log WHERE user_id = %s", (target_id,))
    cursor.execute("DELETE FROM Users WHERE user_id = %s", (target_id,))
    connection.commit()
    rows_deleted = cursor.rowcount
    cursor.close()
    connection.close()
    return rows_deleted


# ADMIN: PLACES
def add_place(name, place_type, address, city, state):
    connection = get_db()
    cursor = connection.cursor()
    query = """
    INSERT INTO Places (place_name, place_type, address, city, state, total_reviews, avg_rating)
    VALUES (%s, %s, %s, %s, %s, 0, 0)
    """
    cursor.execute(query, (name, place_type, address, city, state))
    connection.commit()
    new_id = cursor.lastrowid
    cursor.close()
    connection.close()
    return new_id


def update_place(place_id, name, place_type, address, city, state):
    connection = get_db()
    cursor = connection.cursor()
    # FIX: the SET clause previously also included `user_role = %s`, left
    # over from update_user() — Places has no such column, and it left the
    # query with 7 placeholders but only 6 bound params (name, place_type,
    # address, city, state, place_id), which raised a "not enough arguments
    # for format string" error on every place edit. Removed below.
    query = """
    UPDATE Places
    SET place_name = %s, place_type = %s, address = %s, city = %s, state = %s
    WHERE place_id = %s
    """
    cursor.execute(query, (name, place_type, address, city, state, place_id))
    connection.commit()
    rows_updated = cursor.rowcount
    cursor.close()
    connection.close()
    return rows_updated


def delete_place(place_id):
    connection = get_db()
    cursor = connection.cursor()
    # Delete child rows first (no ON DELETE CASCADE in the schema)
    cursor.execute("DELETE FROM Reviews WHERE place_id = %s", (place_id,))
    cursor.execute("DELETE FROM Favorites WHERE place_id = %s", (place_id,))
    cursor.execute("DELETE FROM PlaceAmenities WHERE place_id = %s", (place_id,))
    cursor.execute("DELETE FROM OpeningHours WHERE place_id = %s", (place_id,))
    cursor.execute("DELETE FROM Places WHERE place_id = %s", (place_id,))
    connection.commit()
    rows_deleted = cursor.rowcount
    cursor.close()
    connection.close()
    return rows_deleted