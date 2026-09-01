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


@app.route('/register', methods=['POST'])
def newuser():
    try:
        data = request.get_json()

        fname = data.get('fname')
        lname = data.get('lname')
        pword = data.get('pass_word')
        email = data.get('email')
        ph_num = data.get('phone')
        address = data.get('address')
        city = data.get('city')
        state = data.get('state')
        uname = data.get('username')

        mycursor = myDB.cursor()

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
        myDB.commit()

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





if __name__ == "__main__":
    app.run(debug=True)