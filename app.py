from flask import Flask, request, jsonify, redirect, url_for, render_template, make_response
from werkzeug.security import check_password_hash, generate_password_hash
import os
import json
from functools import wraps


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
        return {'users': []}  # Return an empty dictionary with a 'users' key
    with open('users.json', 'r') as f:
        return json.load(f)

# Save users to the JSON file
def save_users(users):
    with open('users.json', 'w') as f:
        json.dump({'users': users}, f, indent=4)  # Save the 'users' key

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

    # Load existing user data from the main JSON file
    user_data = load_users()
    users = user_data.get('users', [])

    # Check if the user already exists
    if any(u['email'] == username for u in users):
        return jsonify({'success': False, 'message': 'User already exists'}), 400

    # Add the new user to the list
    new_user = {
        'email': username,
        'password': hashed_password,
        'role': role,
        'fac_id': fac_id
    }
    users.append(new_user)

    # Save the updated user data back to the main JSON file
    save_users(users)

    # Create a new JSON file for the user based on fac_id
    user_data_filename = f"{fac_id}_user_data.json"
    
    # Create or reference the user data JSON file
    if not os.path.exists(user_data_filename):
        with open(user_data_filename, 'w') as json_file:
            json.dump({'users': []}, json_file)  # Initialize with an empty user list

    # Load existing user data from the fac_id specific file
    with open(user_data_filename, 'r') as json_file:
        fac_user_data = json.load(json_file)

    # Append the new user to the specific fac_id file
    fac_user_data['users'].append(new_user)

    # Save the updated user data back to the fac_id specific JSON file
    with open(user_data_filename, 'w') as json_file:
        json.dump(fac_user_data, json_file, indent=4)

    return jsonify({'success': True, 'message': 'User created successfully'}), 201

@app.route('/login1', methods=['POST'])
def login1():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Load users from the JSON file
    users_data = load_users()
    users = users_data.get('users', [])  # Get the list of users from the dictionary

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

@app.route('/registration')
def registration():
    return render_template("registration.html")



@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    name = data.get('name')
    fac_id = data.get('facultyId')
    email = data.get('email')
    phone = data.get('phone')
    address = data.get('address')
    landmark = data.get('landmark')
    state = data.get('state')
    city = data.get('city')
    zip_code = data.get('zip')

    # Prepare the user data as a dictionary
    user_data = {
        "name": name,
        "facultyId": fac_id,
        "email": email,
        "phone": phone,
        "address": address,
        "landmark": landmark,
        "state": state,
        "city": city,
        "zip": zip_code
    }

    # Define the file path
    user_data_filename = f"{fac_id}_user_data.json"
    user_data_filepath = os.path.join(user_data_filename)

    try:
        # Read existing data
        if os.path.exists(user_data_filepath):
            with open(user_data_filepath, 'r') as json_file:
                # Load existing data
                existing_data = json.load(json_file)

                # Check if the existing data is a list
                if not isinstance(existing_data, list):
                    # If it's not a list, wrap it in a list
                    existing_data = [existing_data]
        else:
            existing_data = []  # If file does not exist, start with an empty list

        # Append new user data
        existing_data.append(user_data)

        # Write back to the same file
        with open(user_data_filepath, 'w') as json_file:
            json.dump(existing_data, json_file, indent=4)

        return jsonify({"message": "Registration successful"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
