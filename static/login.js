document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Basic frontend validation
        if (!username || !password) {
            alert('Please fill out both fields');
            return;
        }

        try {
            const response = await fetch('/login1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (result.success) {
                // Store user role in localStorage
                localStorage.setItem('userRole', result.role);

                // Check the user's role and redirect accordingly
                if (result.role === 'admin') {
                    // Redirect to the admin panel if the user is an admin
                    window.location.href = '/admin';
                } else {
                    // Otherwise, redirect to the index page
                    window.location.href = result.redirect;
                }
            } else {
                alert(result.message); // Show error message on failure
            }

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
});
