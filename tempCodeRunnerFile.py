import json
import os
from werkzeug.security import generate_password_hash

# Function to save users to the JSON file
def save_users(users):
    with open('users.json', 'w') as f:
        json.dump(users, f, indent=4)

# Admin user details
admin_user = {
    'email': 'admin@example.com',  # Replace with your preferred admin email
    'password': generate_password_hash('hello1'),  # Replace with your preferred password
    'role': 'admin',
    'fac_id': 'ADM001'
}

# Check if the users.json file exists
if not os.path.exists('users.json'):
    # If it doesn't exist, create it with the admin user
    users = [admin_user]
    save_users(users)
    print("users.json file created with an admin user.")
else:
    print("users.json already exists.")
