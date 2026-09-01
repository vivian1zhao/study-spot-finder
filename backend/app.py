from flask import Flask, jsonify, request, Response
from controllers.places_reviews_controller import places_reviews_bp
from controllers.favs_placedetails_controller import favs_placedetails_bp
import mysql.connector
import json
from myDB import get_db

app = Flask(__name__)
app.json.sort_keys = False
app = Flask(__name__)

app.register_blueprint(places_reviews_bp, url_prefix="/")
app.register_blueprint(favs_placedetails_bp, url_prefix="/")

#login api
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Recieved login data:", data) #DEBUG log

        db = get_db()

        username = data.get("username")
        password = data.get("pass_word")
        mycursor = db.cursor(dictionary=True)
        mycursor.execute("SELECT user_id, username FROM Users WHERE username = %s AND pass_word = %s",(username, password))

        user = mycursor.fetchone()
        mycursor.close()
        db.close()
        if user:
            print("Login successful")
            return jsonify({"message": "Login successful", "user_id": user["user_id"]}), 200

        print("Invalid credentials")
        return jsonify({"message": "Invalid username and/or password"}), 401

    except Exception as e:
        print("Login exception:", str(e))
        return jsonify({"message": "Error processing login request"}), 400



#User making an account api
@app.route('/register', methods=['POST'])
def newuser():
    try:
        data = request.get_json()
        db = get_db()
        fname = data.get('fname')
        lname = data.get('lname')
        pword = data.get('pass_word')
        email = data.get('email')
        ph_num = data.get('phone')
        address = data.get('address')
        city = data.get('city')
        state = data.get('state')
        uname = data.get('username')

        mycursor = db.cursor()

        # Check for duplicate username before inserting
        mycursor.execute("SELECT user_id FROM Users WHERE username = %s", (uname,))
        if mycursor.fetchone():
            return jsonify({"message": "Username already taken"}), 409

        
        sql = ("insert into Users(fname, lname, pass_word, email, phone, address, city, state, username)"
            "values (%s,%s,%s,%s,%s,%s,%s,%s,%s)")
        vals = (fname, lname, pword, email, ph_num, address, city, state, uname)
        print("Placeholder count:", sql.count('%s'))
        print("Vals count:", len(vals))
        print("Vals:", vals)
        mycursor.execute(sql, vals)
        db.commit()
        db.close()
        newId = mycursor.lastrowid
        new_record = {
            "user_id" : newId,
            "fname" : fname,
            "lname" : lname,
            "email" : email,
            "phone" : ph_num,
            "address" : address,
            "city" : city,
            "state" : state,
            "username" : uname
        }
        
        return jsonify({"record": new_record, "message": "Record added"}), 201
        
    except Exception as e:
        print("Register exception:", str(e))
        return jsonify({"message": "Error processing registration"}), 400
    finally:
        if db:
            db.close()


#function to trigger the admin routes by seeing if the user is a admin via user_role

from functools import wraps

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data = request.get_json()
        role = data.get("user_role")

        if role != "admin":
            return jsonify({"message": "Admin access required"}), 403

        return f(*args, **kwargs)
    return decorated_function

"""

Admin routes for places/study spots

"""
#admin route to add a new study spot
@app.route('/admin/places', methods=['POST']) #Tested and Worked
@admin_required
def add_place():
    try:
        data = request.get_json()
        name = data.get("place_name")
        place_type = data.get("place_type")
        address = data.get("address")
        city = data.get("city")
        state = data.get("state")
        db = get_db()
        mycursor = db.cursor()
        sql = ("INSERT INTO Places (place_name, place_type, address, city, state, total_reviews, avg_rating) "
               "VALUES (%s, %s, %s, %s, %s, 0, 0)")
        vals = (name, place_type, address, city, state)
        mycursor.execute(sql, vals)
        db.commit()

        return jsonify({"message": "Place added", "place_id": mycursor.lastrowid}), 201
    except Exception as e:
        print("Add place exception:", str(e))
        return jsonify({"message": "Error adding place"}), 400
    finally:
        if db:
            db.close()
# admin route to edit a study spot
@app.route('/admin/places/<int:place_id>', methods=['PUT']) #Tested and Worked
@admin_required
def edit_place(place_id):
    try:
        data = request.get_json()
        name = data.get("place_name")
        place_type = data.get("place_type")
        address = data.get("address")
        city = data.get("city")
        state = data.get("state")

        db = get_db()
        mycursor = db.cursor()
        sql = ("UPDATE Places SET place_name=%s, place_type=%s, address=%s, city=%s, state=%s "
               "WHERE place_id=%s")
        vals = (name, place_type, address, city, state, place_id)
        mycursor.execute(sql, vals)
        db.commit()

        if mycursor.rowcount == 0:
            return jsonify({"message": "Place not found"}), 404

        return jsonify({"message": "Place updated"}), 200
    except Exception as e:
        print("Edit place exception:", str(e))
        return jsonify({"message": "Error updating place"}), 400
    finally:
        if db:
            db.close()
# admin route to delete a study spot
@app.route('/admin/places/<int:place_id>', methods=['DELETE']) 
# Tested and Failed, because place id is a foriegn key in other tables
#Tested and Worked
@admin_required
def delete_place(place_id):
    try:
        db = get_db()
        mycursor = db.cursor()
        #Delete the id in the child tables before deleting in the parent table
        #can be avoided with update on cascade and delete on cascade in sql syntax
        mycursor.execute("DELETE FROM reviews WHERE place_id = %s", (place_id,))
        mycursor.execute("DELETE FROM favorites WHERE place_id = %s", (place_id,))
        mycursor.execute("DELETE FROM placeamenities WHERE place_id = %s", (place_id,))
        mycursor.execute("DELETE FROM openinghours WHERE place_id = %s", (place_id,))

        mycursor.execute("DELETE FROM Places WHERE place_id = %s", (place_id,))
        db.commit()

        if mycursor.rowcount == 0:
            return jsonify({"message": "Place not found"}), 404

        return jsonify({"message": "Place deleted"}), 200
    except Exception as e:
        print("Delete place exception:", str(e))
        return jsonify({"message": "Error deleting place"}), 400
    finally:
        if db:
            db.close()
"""

Admin routes for users

"""
#admin route to edit a user
@app.route('/admin/users/<int:target_id>', methods=['PUT']) #Tested and Worked
@admin_required
def edit_user(target_id):
    try:
        data = request.get_json()
        fname = data.get("fname")
        lname = data.get("lname")
        email = data.get("email")
        user_role = data.get("user_role")

        db = get_db()
        mycursor = myDB.cursor()
        sql = "UPDATE Users SET fname=%s, lname=%s, email=%s, user_role=%s WHERE user_id=%s"
        vals = (fname, lname, email, user_role, target_id)
        mycursor.execute(sql, vals)
        db.commit()

        if mycursor.rowcount == 0:
            return jsonify({"message": "User not found"}), 404

        return jsonify({"message": "User updated"}), 200
    except Exception as e:
        print("Edit user exception:", str(e))
        return jsonify({"message": "Error updating user"}), 400
    finally:
        if db:
            db.close()
#admin route to delete a user
@app.route('/admin/users/<int:target_id>', methods=['DELETE']) 
# Tested and Failed, because user id is a foriegn key in other tables
#Tested and Worked
@admin_required
def delete_user(target_id):
    try:
        db=get_db()
        mycursor = db.cursor()
        #Delete the id in the child tables before deleting in the parent table
        mycursor.execute("DELETE FROM reviews WHERE user_id = %s", (target_id,))
        mycursor.execute("DELETE FROM favorites WHERE user_id = %s", (target_id,))
        mycursor.execute("DELETE FROM audit_log WHERE user_id = %s", (target_id,))
        
        mycursor.execute("DELETE FROM Users WHERE user_id = %s", (target_id,))
        db.commit()

        if mycursor.rowcount == 0:
            return jsonify({"message": "User not found"}), 404

        return jsonify({"message": "User deleted"}), 200
    except Exception as e:
        print("Delete user exception:", str(e))
        return jsonify({"message": "Error deleting user"}), 400
    finally:
        if db:
            db.close()

if __name__ == "__main__":
    app.run(debug=True)
