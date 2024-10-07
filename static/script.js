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
const canvas = document.getElementById('capturedImage');
const context = canvas.getContext('2d');
let stream = null;
let cameraState = 'stopped'; // Track camera state

// Function to start the camera
function startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(mediaStream) {
                stream = mediaStream;
                videoElement.srcObject = mediaStream;
                videoElement.style.display = 'block'; // Show the video
                toggleButton.textContent = 'Capture Image'; // Change button text
                cameraState = 'running'; // Update state
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
        cameraState = 'stopped'; // Update state
    }
}

// Function to capture the image
function captureImage() {
    canvas.width = videoElement.videoWidth; // Set canvas width to video width
    canvas.height = videoElement.videoHeight; // Set canvas height to video height
    context.drawImage(videoElement, 0, 0); // Draw the video frame to canvas

    // Get the image data URL
    const imageDataUrl = canvas.toDataURL('image/png');

    // Gather additional form data
    const fac_id = document.getElementById('fac_id').value; // Get fac_id from input

    // Send the image to the server
    uploadImage(imageDataUrl, fac_id);
}

// Function to upload the image to the server
function uploadImage(imageData, fac_id) {
    // Remove the data URL prefix (data:image/png;base64,) before sending
    if (imageData.startsWith('data:image/png;base64,')) {
        imageData = imageData.split(',')[1];
    }

    // Send the image data to the Flask server
    fetch('/upload-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData, fac_id }), // Send the image data as JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message); // Display success message
        } else {
            alert('Image upload failed!'); // Handle error case
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
// Toggle camera and capture image
toggleButton.addEventListener('click', function() {
    if (cameraState === 'stopped') {
        startCamera(); // If the camera is off, start it
    } else if (cameraState === 'running') {
        captureImage(); // If the camera is on, capture the image
        toggleButton.textContent = 'Stop Camera'; // Change button text to stop
        cameraState = 'captured'; // Update state
    } else if (cameraState === 'captured') {
        stopCamera(); // If an image has been captured, stop the camera
    }
});




// regis form
function submitForm() {
    // Gather form data
    const name = document.getElementById('name').value;
    console.log(name);
    const fac_id = document.getElementById('fac_id').value;
    console.log(fac_id);
    const email = document.getElementById('email').value;
    console.log(email);
    const phone = document.getElementById('phone').value;
    console.log(phone);
    const address = document.getElementById('address').value;
    console.log(address);
    const landmark = document.getElementById('landmark').value;
    console.log(landmark);
    const state = document.getElementById('state').value;
    console.log(state);
    const city = document.getElementById('city').value;
    console.log(city);
    const zip = document.getElementById('zip').value;
    console.log(zip);


    // Send data to the server
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            fac_id: fac_id,
            email: email,
            phone: phone,
            address: address,
            landmark: landmark,
            state: state,
            city: city,
            zip: zip
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful!');
        } else {
            alert('Done');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
