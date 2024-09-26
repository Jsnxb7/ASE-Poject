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

// calender
document.addEventListener('DOMContentLoaded', function () {
    const monthYear = document.getElementById('month-year');
    const daysContainer = document.getElementById('days');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const popup = document.getElementById('popup');
    const popupContent = document.querySelector('.popup-content');
    const closePopup = document.getElementById('close-popup');
    const selectedDay = document.getElementById('selected-day');

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let currentDate = new Date();
    let today = new Date();

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();

        monthYear.textContent = `${months[month]} ${year}`;
        daysContainer.innerHTML = '';

        // Previous month's dates
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDay; i > 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = prevMonthLastDay - i + 1;
            dayDiv.classList.add('fade');
            daysContainer.appendChild(dayDiv);
        }

        // Current month's dates
        for (let i = 1; i <= lastDay; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayDiv.classList.add('today');
            }

            // Add click event to open popup
            dayDiv.addEventListener('click', function () {
                selectedDay.textContent = `${months[month]} ${i}, ${year}`;
                popup.classList.add('show');
                popupContent.classList.add('show');
            });

            daysContainer.appendChild(dayDiv);
        }

        // Next month's dates
        const nextMonthStartDay = 7 - new Date(year, month + 1, 0).getDay() - 1;
        for (let i = 1; i <= nextMonthStartDay; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;
            dayDiv.classList.add('fade');
            daysContainer.appendChild(dayDiv);
        }
    }

    // Handle previous and next month buttons
    prevButton.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextButton.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    // Close popup when clicking "X"
    closePopup.addEventListener('click', function () {
        popup.classList.remove('show');
        popupContent.classList.remove('show');
    });

    // Close popup when clicking outside of the popup content
    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            popup.classList.remove('show');
            popupContent.classList.remove('show');
        }
    });

    // Render the initial calendar
    renderCalendar(currentDate);
});


// Example JavaScript to dynamically update progress
document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.getElementById('progressBar');
    let progress = 75; // Suppose this value is dynamic

    progressBar.querySelector('.progress').style.width = progress + '%';
    progressBar.querySelector('.progress').textContent = progress + '% Complete';
});


// Add event listeners to circles for toggling completion class
    document.addEventListener('DOMContentLoaded', function() {
        const circles = document.querySelectorAll('.circle');
        circles.forEach(circle => {
            circle.addEventListener('click', function() {
                this.classList.toggle('completed');
            });
        });
    });


// Camera for face


const videoElement = document.getElementById('cameraPreview');
const toggleButton = document.getElementById('toggleCamera');
let stream = null;

// Function to start the camera
function startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(mediaStream) {
                stream = mediaStream;
                videoElement.srcObject = mediaStream;
                videoElement.style.display = 'block'; // Show the video
                toggleButton.textContent = 'Stop Camera'; // Change button text
            })
            .catch(function(error) {
                console.error("Error accessing the camera: ", error);
            });
    } else {
        alert("Your browser does not support camera access.");
    }
}

// Function to stop the camera
function stopCamera() {
    if (stream) {
        let tracks = stream.getTracks(); // Get all media tracks (video/audio)
        tracks.forEach(track => track.stop()); // Stop each track
        videoElement.srcObject = null; // Clear the video source
        videoElement.style.display = 'none'; // Hide the video
        toggleButton.textContent = 'Start Camera'; // Change button text
        stream = null; // Reset the stream
    }
}

// Toggle camera on/off
toggleButton.addEventListener('click', function() {
    if (stream) {
        stopCamera(); // If the camera is on, stop it
    } else {
        startCamera(); // If the camera is off, start it
    }
});




// registration data


function submitForm(event) {
    // Prevent the form from submitting the traditional way
    event.preventDefault();

    // Retrieve individual form field values
    const name = document.getElementById('name').value;
    const facultyId = document.getElementById('faculty-id').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const landmark = document.getElementById('landmark').value;
    const state = document.getElementById('state').value;
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;

    // Log to check if values are being retrieved
    console.log('Name:', name);
    console.log('Faculty ID:', facultyId);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Address:', address);
    console.log('Landmark:', landmark);
    console.log('State:', state);
    console.log('City:', city);
    console.log('Zip:', zip);

    // Check if any fields are null or empty
    if (!name || !facultyId || !email || !phone || !address || !state || !city || !zip) {
        alert("Please fill in all required fields.");
        return;
    }

    // Send the data via fetch to Flask, passing each field separately
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            facultyId: facultyId,
            email: email,
            phone: phone,
            address: address,
            landmark: landmark,
            state: state,
            city: city,
            zip: zip
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.message) {
            alert('Registration successful!');
        } else {
            alert('Error: ' + result.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the form.');
    });
}
