from flask import Flask, jsonify, request, Response
import mysql.connector
import json

app = Flask(__name__)
app.json.sort_keys = False

myDB = mysql.connector.connect(
    host = 'localhost',
    database = 'studyspots',
    user = 'root',
    password = 'admin'
)


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

        mycursor = myDB.cursor()
        sql = ("INSERT INTO Places (place_name, place_type, address, city, state, total_reviews, avg_rating) "
               "VALUES (%s, %s, %s, %s, %s, 0, 0)")
        vals = (name, place_type, address, city, state)
        mycursor.execute(sql, vals)
        myDB.commit()

        return jsonify({"message": "Place added", "place_id": mycursor.lastrowid}), 201
    except Exception as e:
        print("Add place exception:", str(e))
        return jsonify({"message": "Error adding place"}), 400

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

        mycursor = myDB.cursor()
        sql = ("UPDATE Places SET place_name=%s, place_type=%s, address=%s, city=%s, state=%s "
               "WHERE place_id=%s")
        vals = (name, place_type, address, city, state, place_id)
        mycursor.execute(sql, vals)
        myDB.commit()

        if mycursor.rowcount == 0:
            return jsonify({"message": "Place not found"}), 404

        return jsonify({"message": "Place updated"}), 200
    except Exception as e:
        print("Edit place exception:", str(e))
        return jsonify({"message": "Error updating place"}), 400

# admin route to delete a study spot
@app.route('/admin/places/<int:place_id>', methods=['DELETE']) 
# Tested and Failed, because place id is a foriegn key in other tables
#Tested and Worked
@admin_required
def delete_place(place_id):
    try:
        mycursor = myDB.cursor()
        #Delete the id in the child tables before deleting in the parent table
        #can be avoided with update on cascade and delete on cascade in sql syntax
        mycursor.execute("DELETE FROM reviews WHERE place_id = %s", (place_id,))
        mycursor.execute("DELETE FROM favorites WHERE place_id = %s", (place_id,))
        mycursor.execute("DELETE FROM placeamenities WHERE place_id = %s", (place_id,))
        mycursor.execute("DELETE FROM openinghours WHERE place_id = %s", (place_id,))

        mycursor.execute("DELETE FROM Places WHERE place_id = %s", (place_id,))
        myDB.commit()

        if mycursor.rowcount == 0:
            return jsonify({"message": "Place not found"}), 404

        return jsonify({"message": "Place deleted"}), 200
    except Exception as e:
        print("Delete place exception:", str(e))
        return jsonify({"message": "Error deleting place"}), 400

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

        mycursor = myDB.cursor()
        sql = "UPDATE Users SET fname=%s, lname=%s, email=%s, user_role=%s WHERE user_id=%s"
        vals = (fname, lname, email, user_role, target_id)
        mycursor.execute(sql, vals)
        myDB.commit()

        if mycursor.rowcount == 0:
            return jsonify({"message": "User not found"}), 404

        return jsonify({"message": "User updated"}), 200
    except Exception as e:
        print("Edit user exception:", str(e))
        return jsonify({"message": "Error updating user"}), 400

#admin route to delete a user
@app.route('/admin/users/<int:target_id>', methods=['DELETE']) 
# Tested and Failed, because user id is a foriegn key in other tables
#Tested and Worked
@admin_required
def delete_user(target_id):
    try:
        mycursor = myDB.cursor()
        #Delete the id in the child tables before deleting in the parent table
        mycursor.execute("DELETE FROM reviews WHERE user_id = %s", (target_id,))
        mycursor.execute("DELETE FROM favorites WHERE user_id = %s", (target_id,))
        mycursor.execute("DELETE FROM audit_log WHERE user_id = %s", (target_id,))
        
        mycursor.execute("DELETE FROM Users WHERE user_id = %s", (target_id,))
        myDB.commit()

        if mycursor.rowcount == 0:
            return jsonify({"message": "User not found"}), 404

        return jsonify({"message": "User deleted"}), 200
    except Exception as e:
        print("Delete user exception:", str(e))
        return jsonify({"message": "Error deleting user"}), 400

if __name__ == "__main__":
    app.run(debug=True)