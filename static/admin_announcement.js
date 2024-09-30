document.addEventListener("DOMContentLoaded", function () {
    const announcementForm = document.querySelector("form");
    const fileInput = document.getElementById("file-upload");
    const submitButton = document.querySelector(".submit-btn");

    // Function to validate the form fields
    function validateForm() {
        const title = document.getElementById("announcement-title").value.trim();
        const description = document.getElementById("description").value.trim();
        const date = document.getElementById("date").value.trim();
        const type = document.getElementById("announcement-type").value;
        const priority = document.getElementById("priority").value;

        if (!title || !date || !type || !priority) {
            alert("Please fill in all required fields.");
            return false;
        }

        if (description.length > 1000) {
            alert("Description is too long. Please limit it to 1000 characters.");
            return false;
        }

        return true;
    }

    // Handle form submission via AJAX
    announcementForm.addEventListener("submit", function (event) {
        // Prevent the default form submission
        event.preventDefault();

        // Validate the form
        if (!validateForm()) {
            return;
        }

        // Create FormData object to include form fields and files
        const formData = new FormData(announcementForm);

        // Send form data using fetch (AJAX request)
        fetch('/admin_announcement/make_announcement', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Announcement posted successfully!");
                announcementForm.reset();  // Reset form after success
            } else {
                alert("Failed to post announcement. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while posting the announcement.");
        });
    });
});
