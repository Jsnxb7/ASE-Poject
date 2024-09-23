from flask import Flask, request, jsonify, redirect, url_for, render_template, make_response
from werkzeug.security import check_password_hash, generate_password_hash
import os
import json
from functools import wraps

#pass = hello16

app = Flask(__name__)


@app.route('/')
def login():
    return render_template('login.html')

@app.route('/admin', methods=['GET'])
def admin_panel():
    return render_template('admin_panel.html')

# Load users from the JSON file
def load_users():
    if not os.path.exists('users.json'):
        return []
    with open('users.json', 'r') as f:
        return json.load(f)

# Save users to the JSON file
def save_users(users):
    with open('users.json', 'w') as f:
        json.dump(users, f, indent=4)

@app.route('/admin/create_user', methods=['POST'])
def create_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')
    fac_id = data.get('fac_id')

    if not username or not password or not role or not fac_id:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    hashed_password = generate_password_hash(password)

    # Create or reference the user data JSON file based on fac_id
    user_data_filename = f"{fac_id}_user_data.json"
    user_data_path = os.path.join(user_data_filename)

    # Check if the file already exists
    if not os.path.exists(user_data_path):
        # Create a new JSON file with an empty user list
        with open(user_data_path, 'w') as json_file:
            json.dump({'users': []}, json_file)  # Use 'users' as the key for the list

    # Load existing user data
    with open(user_data_path, 'r') as json_file:
        user_data = json.load(json_file)

    # Add the new user to the user data
    new_user = {
        'email': username,
        'password': hashed_password,
        'role': role,
        'fac_id': fac_id
    }
    user_data['users'].append(new_user)

    # Save the updated user data back to the JSON file
    with open(user_data_path, 'w') as json_file:
        json.dump(user_data, json_file)

    return jsonify({'success': True, 'message': 'User created successfully'}), 201

@app.route('/login1', methods=['POST'])
def login1():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Load users from the JSON file
    users = load_users()

    # Find the user in the JSON data
    user = next((u for u in users if u['email'] == username), None)

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
