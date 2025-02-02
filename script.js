const storiesContainer = document.getElementById('storiesContainer');
const storyViewer = document.getElementById('storyViewer');
const storyViewerContent = document.getElementById('storyViewerContent');
const storyViewerTitle = document.getElementById('storyViewerTitle');
const progressBar = document.getElementById('progressBar');

let storyQueue = [];
let currentStoryIndex = 0;
let progressTimeout;
let isAllStoriesShown = false; // To track if all stories have been shown

function addStories() {
    const mediaInput = document.getElementById('mediaInput');
    const storyTitleInput = document.getElementById('storyTitle');
    const files = Array.from(mediaInput.files);
    const storyTitle = storyTitleInput.value.trim();

    if (files.length === 0) {
        alert('Please select at least one image or video.');
        return;
    }

    files.forEach((file) => {
        const storyElement = document.createElement('div');
        storyElement.classList.add('story');
        const url = URL.createObjectURL(file);
        const title = storyTitle || "Untitled Story";

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

        storyElement.addEventListener('click', () => {
            // Prevent the footer from showing immediately when a new story is added
            isAllStoriesShown = false; 
            
            storyQueue = Array.from(storiesContainer.children)
                .filter(child => child !== storiesContainer.children[0])
                .map(child => ({
                    src: child.querySelector('img, video').src,
                    type: child.querySelector('img') ? 'image' : 'video',
                    title: title
                }));
            currentStoryIndex = storyQueue.findIndex(item => item.src === url);
            showStory(currentStoryIndex);
        });

        storiesContainer.appendChild(storyElement);
    });

    storyTitleInput.value = '';
    mediaInput.value = '';
}

function showStory(index) {
    if (index < 0 || index >= storyQueue.length) {
        storyViewer.classList.remove('active');
        clearTimeout(progressTimeout);
        return;
    }

    const story = storyQueue[index];
    storyViewerContent.innerHTML = '';
    storyViewerTitle.textContent = story.title;

    // Hide the footer when the story is shown
    let footer = document.querySelector("footer");
    footer.style.display = "none"; 

    // Create and add the close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => {
        const video = storyViewerContent.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        storyViewer.classList.remove('active');
        clearTimeout(progressTimeout);

        // Show the footer when the viewer is closed, even if not all stories are finished
        footer.style.display = "block"; 
    });

    storyViewerContent.appendChild(closeButton);

    if (story.type === 'image') {
        const img = document.createElement('img');
        img.src = story.src;
        storyViewerContent.appendChild(img);
        updateProgressBar(5000, () => {
            if (index + 1 < storyQueue.length) {
                showStory(index + 1);  // Show the next story
            } else {
                isAllStoriesShown = true; // Mark that all stories are shown
                footer.style.display = "block";  // Show the footer after all stories
            }
        });
    } else if (story.type === 'video') {
        const video = document.createElement('video');
        video.src = story.src;
        video.autoplay = true;
        storyViewerContent.appendChild(video);
        video.onloadedmetadata = () => {
            updateProgressBar(15000, () => {
                if (index + 1 < storyQueue.length) {
                    showStory(index + 1);  // Show the next story
                } else {
                    isAllStoriesShown = true; // Mark that all stories are shown
                    footer.style.display = "block";  // Show the footer after all stories
                }
            });
        };

        video.onended = () => {
            // Automatically show the next story when the video ends
            if (index + 1 < storyQueue.length) {
                showStory(index + 1);
            } else {
                isAllStoriesShown = true;
                footer.style.display = "block";  // Show the footer after the last video ends
            }
        };
    }

    storyViewer.classList.add('active');
}

function updateProgressBar(duration, callback) {
    progressBar.style.width = '0%';
    progressBar.style.transition = 'none';

    requestAnimationFrame(() => {
        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = '100%';

        setTimeout(() => {
            if (typeof callback === 'function') {
                callback();
            }
        }, duration);
    });
}
<<<<<<< Updated upstream
=======

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

const prevButton = document.querySelector('.previous-btn');
const nextButton = document.querySelector('.next-btn');
const storyContainer = document.querySelector('.stories-container .content');

prevButton.addEventListener('click', () => {
    storyContainer.scrollBy({
        left: -storyContainer.offsetWidth,
        behavior: 'smooth'
    });
});

nextButton.addEventListener('click', () => {
    storyContainer.scrollBy({
        left: storyContainer.offsetWidth,
        behavior: 'smooth'
    });
});

// Open the modal when user clicks "Add Story"
document.querySelector('.add-story').addEventListener('click', function() {
    const modal = document.querySelector('.story-modal');
    modal.classList.add('active');  // Add the active class to show the modal
});

// Close the modal when user clicks "X"
document.querySelector('.close-modal').addEventListener('click', function() {
    const modal = document.querySelector('.story-modal');
    modal.classList.remove('active');  // Remove the active class to hide the modal
});

// Handle image or video preview
const mediaInput = document.getElementById('mediaInput');  // Input for file upload
const storyPreview = document.getElementById('storyPreview');
const storyVideoPreview = document.getElementById('storyVideoPreview');

mediaInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        if (file.type.startsWith('image/')) {
            storyPreview.src = fileURL;
            storyPreview.style.display = 'block';
            storyVideoPreview.style.display = 'none';
        } else if (file.type.startsWith('video/')) {
            storyVideoPreview.src = fileURL;
            storyVideoPreview.style.display = 'block';
            storyPreview.style.display = 'none';
        }
    }
});

// Crop button functionality (example)
document.querySelector('.crop-btn').addEventListener('click', function() {
    // Use a cropping library like Cropper.js to crop the image or video
    // Example: Open Cropper.js for image cropping
    if (storyPreview.style.display !== 'none') {
        const cropper = new Cropper(storyPreview, {
            aspectRatio: 16 / 9,
            viewMode: 1,
            autoCropArea: 0.8,
        });
    }
});

// Trim button functionality (example for video trimming)
document.querySelector('.trim-btn').addEventListener('click', function() {
    // Implement video trimming using HTML5 Video API or a library like Video.js
    if (storyVideoPreview.style.display !== 'none') {
        // Code to trim video (you can use the HTML5 Video API to set start and end time)
        storyVideoPreview.currentTime = 0; // Example: trim to start at the beginning
    }
});

// Music button functionality (optional)
document.querySelector('.music-btn').addEventListener('click', function() {
    // Open a music selection modal or popup
    alert('Add music functionality goes here.');
});

// Save Story button (just a placeholder for now)
document.querySelector('.save-btn').addEventListener('click', function() {
    alert('Story saved!');
    document.querySelector('.story-modal').style.display = 'none';
});

// Function to open the modal when "Post Stories" is clicked
function openStoryModal() {
    const modal = document.getElementById('storyModal');
    modal.style.display = 'block'; // Make the modal visible
}

// Function to close the modal when "X" is clicked
function closeStoryModal() {
    const modal = document.getElementById('storyModal');
    modal.style.display = 'none'; // Hide the modal
}

// Function to handle the file input and preview the selected media
document.getElementById('mediaInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const storyPreview = document.getElementById('storyPreview');
    const storyVideoPreview = document.getElementById('storyVideoPreview');

    if (file) {
        // Check if the file is an image or a video
        if (file.type.startsWith('image/')) {
            storyPreview.style.display = 'block';
            storyVideoPreview.style.display = 'none';
            storyPreview.src = URL.createObjectURL(file); // Preview the image
        } else if (file.type.startsWith('video/')) {
            storyPreview.style.display = 'none';
            storyVideoPreview.style.display = 'block';
            storyVideoPreview.src = URL.createObjectURL(file); // Preview the video
        }
    }
});

// Function to save the story (You can add more logic here for saving)
function saveStory() {
    const storyTitle = document.getElementById('storyTitle').value;
    const mediaInput = document.getElementById('mediaInput').files[0];

    if (storyTitle && mediaInput) {
        // Process saving the story (e.g., sending to server or adding to UI)
        console.log('Story saved: ', storyTitle, mediaInput);

        // Close the modal after saving
        closeStoryModal();
    } else {
        alert('Please provide a title and media to post the story!');
    }
}
>>>>>>> Stashed changes
