let cropper;
let croppedImage = null;

// Dark Mode//
// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

darkModeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-mode');
    const icon = darkModeToggle.querySelector('.material-symbols-outlined');

    // Add animation class
    icon.classList.add('icon-animation');

    // Change the icon text content based on dark mode status
    if (body.classList.contains('dark-mode')) {
        icon.textContent = 'light_mode';  // Change icon to 'light_mode'
    } else {
        icon.textContent = 'dark_mode';   // Change icon back to 'dark_mode'
    }

    // Remove the animation class after animation duration to reset
    setTimeout(() => {
        icon.classList.remove('icon-animation');
    }, 300); // 300ms should match the duration of your animation
});


// File Name // 
// JavaScript to display the uploaded file name
document.getElementById('mediaInput').addEventListener('change', function() {
    var fileInput = document.getElementById('mediaInput');
    var fileNameDisplay = document.getElementById('fileNameDisplay');
    
    // Check if files are selected
    if (fileInput.files.length > 0) {
        var fileName = fileInput.files[0].name;  // Get the name of the first file
        fileNameDisplay.textContent = 'Selected File: ' + fileName; // Display the file name
    } else {
        fileNameDisplay.textContent = '';  // Clear the file name display if no file is selected
    }
});

// For Stories //

const storiesContainer = document.getElementById('storiesContainer');
const storyViewer = document.getElementById('storyViewer');
const storyViewerContent = document.getElementById('storyViewerContent');
const storyViewerTitle = document.getElementById('storyViewerTitle');
const progressBar = document.getElementById('progressBar');
const prevButton = document.querySelector('#prevButton');
const nextButton = document.querySelector('#nextButton');

let storyQueue = [];
let currentStoryIndex = 0;
let progressTimeout;

// Add story function
function addStories() {
    const mediaInput = document.getElementById('mediaInput');
    const storyTitleInput = document.getElementById('storyTitle');
    const files = Array.from(mediaInput.files);
    const storyTitle = storyTitleInput.value.trim();
    
    if (!storyTitle.trim()) {
        alert("The story title should not be empty.");
        return; // Stop further execution if title is empty
    }

    if (files.length === 0) {
        alert('Please select at least one image or video.');
        return;
    }

    // Confirmation box before adding stories
    const confirmPost = window.confirm("Are you sure you want to post these stories?");
    
    if (!confirmPost) {
        return; // If user clicks "Cancel", do nothing
    }

    // If confirmed, proceed with adding stories
    files.forEach((file) => {
        const storyElement = document.createElement('div');
        storyElement.classList.add('story');
        const url = URL.createObjectURL(file);

        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = url;
            storyElement.appendChild(img);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = url;
            video.controls = false;
            storyElement.appendChild(video);
        } else {
            alert('Unsupported file type.');
            return;
        }

        // Add story to queue
        const newStory = { src: url, type: file.type.startsWith('image/') ? 'image' : 'video', title: storyTitle };
        storyQueue.push(newStory);

        storyElement.addEventListener('click', () => {
            currentStoryIndex = storyQueue.findIndex(item => item.src === url);
            showStory(currentStoryIndex);
        });

        storiesContainer.appendChild(storyElement);
    });

    // Clear the title input and file input (reset the selected files)
    storyTitleInput.value = '';
    mediaInput.value = '';

    // Clear the filename display (replace this with your actual element's ID or class)
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    if (fileNameDisplay) {
        fileNameDisplay.textContent = ''; // Reset the filename display
    }

    updateNavigationButtons(); // Update navigation buttons after stories are added
}

// Function to show story in full-screen mode
function showStory(index) {
    const story = storyQueue[index]; // Retrieve the story by index
    const modal = document.getElementById('storyModal'); // Assuming you have a modal for full-screen view
    const modalContent = modal.querySelector('.modal-content'); // The content of the modal

    // Clear any existing content in the modal
    modalContent.innerHTML = '';

    // Add the selected story's content to the modal
    if (story.type === 'image') {
        const img = document.createElement('img');
        img.src = story.src;
        modalContent.appendChild(img);
    } else if (story.type === 'video') {
        const video = document.createElement('video');
        video.src = story.src;
        video.controls = true;
        modalContent.appendChild(video);
    }

    // Show the modal
    modal.style.display = 'block';
}

// Close the modal when the user clicks outside the modal content
window.addEventListener('click', (event) => {
    const modal = document.getElementById('storyModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});


// Close story viewer
function closeStoryViewer() {
    storyViewer.classList.remove('active');
    clearTimeout(progressTimeout);

    let footer = document.querySelector("footer");
    if (footer) footer.style.display = "block";

    const video = storyViewerContent.querySelector('video');
    if (video) {
        video.pause();
        video.currentTime = 0;
    }

    progressBar.style.width = '0%';
}

// Function to update the progress bar
function updateProgressBar(duration, callback) {
    progressBar.style.width = '0%';
    progressBar.style.transition = 'none';

    requestAnimationFrame(() => {
        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = '100%';

        progressTimeout = setTimeout(() => {
            if (typeof callback === 'function') callback();
        }, duration);
    });
}

// Show next story
function showNextStory() {
    if (currentStoryIndex < storyQueue.length - 1) {
        showStory(currentStoryIndex + 1);
    } else {
        closeStoryViewer(); // Close viewer if no more stories
    }
}

// Show previous story
function showPreviousStory() {
    if (currentStoryIndex > 0) {
        showStory(currentStoryIndex - 1);
    }
}

// Create the initial stories when page loads or after upload
const createStories = () => {
  allStories.forEach((s, i) => {
    const story = document.createElement("div");
    story.classList.add("story");
    const img = document.createElement("img");
    img.src = s.imageUrl;


    story.appendChild(img);

    storiesContainer.appendChild(story);

    story.addEventListener("click", () => {
      showFullView(i);
    });
  });

  updateNavigationButtons(); // Ensure buttons are updated after initial stories load
};

createStories();

// Function to scroll

// Function to scroll left
function scrollLeft() {
    const container = document.getElementById("storiesContainer");
    container.scrollBy({ left: -120, behavior: 'smooth' });
}

// Function to scroll right
function scrollRight() {
    const container = document.getElementById("storiesContainer");
    container.scrollBy({ left: 120, behavior: 'smooth' });
}


document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("storiesContainer");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    
    // Show prevButton when nextButton is clicked
    nextButton.addEventListener("click", function () {
        scrollRight(); // Ensure scrollRight is available here
        setTimeout(() => {
            prevButton.style.visibility = "visible"; // Ensure it becomes visible
            updateButtonVisibility();
        }, 200);
    });

    // Hide prevButton when reaching the start
    prevButton.addEventListener("click", function () {
        scrollLeft(); // Ensure scrollLeft is available here
        setTimeout(updateButtonVisibility, 200);
    });

    // Attach event listener to update visibility on manual scrolling
    container.addEventListener("scroll", updateButtonVisibility);

    // Call the function initially to set correct visibility on page load
    updateButtonVisibility();
});

// Change Profile Image (when clicking on the profile image)
function changeProfileImage() {
    // Trigger the profile image file input when the profile image is clicked
    document.getElementById('profileImageInput').click();
}

// Preview the profile image (display it as the new profile picture)
function previewProfileImage() {
    const profileImageInput = document.getElementById('profileImageInput');
    const profileImage = document.getElementById('profileImage');
    const file = profileImageInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profileImage.src = e.target.result; // Update the profile image preview
        };
        reader.readAsDataURL(file);
    }
}

// For Story Media
function previewImage() {
    const fileInput = document.getElementById('mediaInput');
    const file = fileInput.files[0]; // Get the first selected file
    const preview = document.getElementById('imagePreview');
    const editTools = document.getElementById("editTools");

    if (file) {
        const reader = new FileReader();

        // Set up the onload function for the file reader
        reader.onload = function(e) {
            console.log("Image loaded successfully!"); // Confirm image loaded

            preview.innerHTML = "";  // Clear existing preview

            const img = document.createElement('img');
            img.src = e.target.result;  // Set the image src to the selected file

            preview.appendChild(img);  // Add the image to the preview

            // Initialize the cropper once the image is loaded
            if (cropper) {
                cropper.destroy();  // Destroy any previous cropper instance
            }

            cropper = new Cropper(img, {
                aspectRatio: 16 / 9, // Example aspect ratio
                viewMode: 1, // Default view mode
                autoCropArea: 0.8, // Default crop area
                responsive: true,
                zoomable: true,
            });

            console.log("Cropper initialized!"); // Confirm cropper initialization

            editTools.style.display = "block"; // Show editing tools after image is ready
        };

        // Read the file as a data URL
        reader.readAsDataURL(file);
    } else {
        alert("Please select an image!");
    }
}


function updateNavigationButtons() {
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const container = document.getElementById('storiesContainer');
    
    if (container.scrollLeft <= 0) {
        prevButton.style.visibility = 'hidden';
    } else {
        prevButton.style.visibility = 'visible';
    }

    if (container.scrollWidth - container.scrollLeft === container.clientWidth) {
        nextButton.style.visibility = 'hidden';
    } else {
        nextButton.style.visibility = 'visible';
    }
}


// Chat Functionality in Messages

function startChat(name) {
    document.querySelector(".chat-header").textContent = name;
    document.querySelector(".messages").innerHTML = "";
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    const messageText = input.value.trim();
    
    if (messageText === "") return;

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "sent");
    messageDiv.textContent = messageText;

    document.querySelector(".messages").appendChild(messageDiv);
    input.value = "";

    setTimeout(() => {
        const responseDiv = document.createElement("div");
        responseDiv.classList.add("message", "received");
        responseDiv.textContent = "Got it!";
        document.querySelector(".messages").appendChild(responseDiv);
    }, 1000);
}



// Modal Script

// Add story from modal
function addStoryFromModal() {
    if (croppedImage) {
        const storiesContainer = document.getElementById('storiesContainer');
        const storyDiv = document.createElement('div');
        storyDiv.classList.add('story');
        storyDiv.style.backgroundImage = `url(${croppedImage})`;
        storyDiv.setAttribute('onclick', `openStoryViewer('${croppedImage}')`);
        storiesContainer.appendChild(storyDiv);
    }
    closeModal();
}

// Open Story Viewer
function openStoryViewer(imageSrc) {
    const storyViewer = document.getElementById('storyViewer');
    const storyViewerContent = document.getElementById('storyViewerContent');
    
    storyViewer.style.display = 'flex';
    storyViewerContent.innerHTML = `<img src="${imageSrc}" class="fullscreen-image" />`;
}

// Close Story Viewer when clicked
document.getElementById('storyViewer').addEventListener('click', function() {
    this.style.display = 'none';
});

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('addStoryModal');
    modal.style.display = 'none';
}

// Function to open the modal (call this where you need to show the modal)
function openModal() {
    const modal = document.getElementById('addStoryModal');
    modal.style.display = 'block';
}

// Preview uploaded story image
function previewStory() {
    const file = document.getElementById('storyFileInput').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imagePreview = document.getElementById('storyPreview');
            imagePreview.innerHTML = `<img src="${e.target.result}" id="storyImage" />`;
            
            // Initialize cropper
            if (cropper) {
                cropper.destroy();
            }

            const image = document.getElementById('storyImage');
            cropper = new Cropper(image, {
                aspectRatio: 1,
                viewMode: 1,
                scalable: true,
                zoomable: true,
                cropBoxResizable: true,
                movable: true,
            });
        };
        reader.readAsDataURL(file);
    }
}

// Rotate image
function rotateImage() {
    if (cropper) {
        cropper.rotate(90);
    }
}

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image.src;

    // Wait for the image to load
    img.onload = function() {
        const width = img.width;
        const height = img.height;

        // Set canvas size (new size after rotation)
        canvas.width = height; 
        canvas.height = width;

        // Rotate the canvas context by 90 degrees
        ctx.translate(height / 2, width / 2); // Move the context to center of the canvas
        ctx.rotate(Math.PI / 2); // Rotate by 90 degrees
        ctx.drawImage(img, -width / 2, -height / 2); // Draw image onto rotated canvas

        // Convert the rotated canvas to a data URL
        const rotatedImageURL = canvas.toDataURL();
        
        // Update the preview with the rotated image
        image.src = rotatedImageURL; // Set the image to the rotated canvas data URL
    };

function previewImageForCropping() {
    const fileInput = document.getElementById("mediaInput");
    const file = fileInput.files[0]; // Get the first selected file
    const preview = document.getElementById("imagePreview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img id="cropperImage" src="${e.target.result}" style="max-width: 100%; height: auto;">`;
            // Initialize cropper only after the image is fully loaded
            const imageElement = document.getElementById("cropperImage");
            imageElement.onload = function() {
                if (cropper) {
                    cropper.destroy(); // Destroy any previous cropper instance
                }
                cropper = new Cropper(imageElement, {
                    aspectRatio: 1,  // Maintain a square crop
                    viewMode: 1,
                    autoCropArea: 0.65
                });
            };
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select an image first!");
    }
}

// Get cropped image
function getCroppedImage() {
    if (cropper) {
        croppedImage = cropper.getCroppedCanvas().toDataURL();
        document.getElementById('storyPreview').innerHTML = `<img src="${croppedImage}" />`;
    }
}


function trimVideo() {
    const videoFile = document.getElementById('mediaInput').files[0];
    if (!videoFile) {
        alert("Please select a video file!");
        return;
    }

    const videoURL = URL.createObjectURL(videoFile);
    const video = document.createElement('video');
    video.src = videoURL;
    video.controls = true;

    video.onloadedmetadata = function() {
        const startTime = 5; // Start trimming at 5 seconds
        const endTime = 15; // End trimming at 15 seconds

        // Ensure the video is loaded before attempting to trim
        if (video.readyState >= 2) {
            ffmpeg({
                MEMFS: [{ name: videoFile.name, data: new Uint8Array(videoFile) }],
                arguments: [
                    '-i', videoFile.name,
                    '-ss', startTime.toString(),
                    '-to', endTime.toString(),
                    '-c', 'copy',
                    'output.mp4'
                ],
                print: function(output) {
                    console.log(output);
                },
                onExit: function(code) {
                    if (code === 0) {
                        const outputFile = ffmpeg.FS('readFile', 'output.mp4');
                        const trimmedVideoBlob = new Blob([outputFile], { type: 'video/mp4' });
                        const trimmedVideoURL = URL.createObjectURL(trimmedVideoBlob);

                        // Update the preview with the trimmed video
                        const preview = document.getElementById('mediaPreview');
                        preview.innerHTML = `<video src="${trimmedVideoURL}" controls></video>`;
                    } else {
                        alert("Video trimming failed.");
                    }
                }
            });
        } else {
            alert("Video is not ready for trimming. Please try again.");
        }
    };

    video.onerror = function() {
        alert("Error loading the video. Please try again.");
    };
}


function postStory() {
    alert("Story posted!");
    closeModal();
}


function previewMedia() {
    const fileInput = document.getElementById("mediaInput");
    const file = fileInput.files[0]; // Get the first selected file
    const preview = document.getElementById("mediaPreview");

    if (file) {
        const fileURL = URL.createObjectURL(file);
        preview.innerHTML = ""; // Clear previous preview

        if (file.type.startsWith("image/")) {
            preview.innerHTML = `<img src="${fileURL}" id="previewImage" style="max-width: 100%; height: auto;">`;
        } else if (file.type.startsWith("video/")) {
            preview.innerHTML = `<video id="previewVideo" controls style="max-width: 100%;">
                                    <source src="${fileURL}" type="${file.type}">
                                  </video>`;
        } else if (file.type.startsWith("audio/")) {
            preview.innerHTML = `<audio id="previewAudio" controls style="max-width: 100%;">
                                    <source src="${fileURL}" type="${file.type}">
                                  </audio>`;
        } else {
            alert('Unsupported file type. Please select an image, video, or audio file.');
        }
    }
}