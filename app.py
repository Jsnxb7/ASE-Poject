from flask import Flask, request, jsonify, redirect, url_for, render_template, make_response
from werkzeug.security import check_password_hash, generate_password_hash
from pymongo import MongoClient
from functools import wraps

#pass = hello16

app = Flask(__name__)


@app.route('/')
def login():
    return render_template('login.html')

client = MongoClient('mongodb://localhost:27017/')
db = client['faculty']
users_collection = db['fac_list']

@app.route('/admin', methods=['GET'])
def admin_panel():
    return render_template('admin_panel.html')

# Make it from MongoDB to Json

@app.route('/admin/create_user', methods=['POST'])
def create_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')
    fac_id = data.get('fac_id')  # Get fac_id from the request

    if not username or not password or not role or not fac_id:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    hashed_password = generate_password_hash(password)

    # Insert new user into MongoDB
    users_collection.insert_one({
        'email': username,
        'password': hashed_password,
        'role': role,
        'fac_id': fac_id
    })

    # Create or reference the collection based on fac_id
    collection_name = f"posts_{fac_id}"
    user_posts_collection = db[collection_name]

    # Insert initial data into the user's posts collection
    initial_data = {
        'email': username,
        'password': hashed_password,
        'role': role,
        'fac_id': fac_id
    }
    user_posts_collection.insert_one(initial_data)

    return jsonify({'success': True, 'message': 'User created successfully'}), 201

@app.route('/login1', methods=['POST'])
def login1():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({'email': username})

    if user and check_password_hash(user['password'], password):
        # Include the user role in the response
        return jsonify({'success': True, 'token': '', 'role': user['role'], 'redirect': url_for('index')}), 200
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/logout')
def logout():
    response = make_response(redirect(url_for('login')))
    response.set_cookie('user_email', '', expires=0)  # Clear the email cookie
    return response

@app.route('/announcement')
def announcement():
    return render_template('Announcement.html')

@app.route('/assignment')
def assignment():
    return render_template('Assignment.html')

@app.route('/lectures')
def lectures():
    return render_template('Lectures.html')

@app.route('/milestones')
def milestones():
    return render_template('Milestone.html')

@app.route('/research')
def research():
    return render_template('Research.html')

@app.route('/contactadmin')
def contactadmin():
    return render_template("contactadmin.html")

@app.route('/profile')
def profile():
    return render_template("profile.html") 

@app.route('/settings')
def settings():
    return render_template("settings.html") 

if __name__ == '__main__':
    app.run(debug=True)
