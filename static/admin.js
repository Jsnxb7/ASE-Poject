document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createUserForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        const fac_id = document.getElementById('fac_id').value; // Get fac_id from the form

        // Basic validation
        if (!username || !password || !role || !fac_id) {
            alert('Please fill out all fields');
            return;
        }

        try {
            const response = await fetch('/admin/create_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role, fac_id }) // Include fac_id in request
            });

            const result = await response.json();

            const messageDiv = document.getElementById('message');
            if (result.success) {
                messageDiv.textContent = 'User created successfully!';
                form.reset();  // Clear form
            } else {
                messageDiv.textContent = `Error: ${result.message}`;
            }

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});

const profileLogo = document.getElementById('profile-logo');
const dropdownMenu = document.getElementById('dropdown-menu');

profileLogo.addEventListener('click', () => {
    // Toggle dropdown visibility
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown if clicked outside
window.addEventListener('click', (e) => {
    if (!profileLogo.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = 'none';
    }
});