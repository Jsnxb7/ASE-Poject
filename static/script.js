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

    // Create a timestamp for the file name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Format timestamp
    const link = document.createElement('a'); // Create a link element
    link.href = imageDataUrl; // Set the link's href to the image data URL
    link.download = `captured_image_${timestamp}.png`; // Set the download attribute with a filename
    link.click(); // Simulate a click on the link to trigger the download

    console.log('Captured Image Data URL:', imageDataUrl); // Log the image data URL
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
