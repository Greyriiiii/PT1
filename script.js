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

let storyQueue = [];
let currentStoryIndex = 0;
let progressTimeout;

// Function to add stories
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
    const fileNameDisplay = document.getElementById('fileNameDisplay'); // Adjust the selector as needed
    if (fileNameDisplay) {
        fileNameDisplay.textContent = ''; // Reset the filename display
    }

    updateNavigationButtons(); // Update navigation buttons after stories are added
}

// Function to show a story
function showStory(index) {
    if (index < 0 || index >= storyQueue.length) {
        closeStoryViewer();
        return;
    }

    currentStoryIndex = index;
    const story = storyQueue[currentStoryIndex];

    storyViewerContent.innerHTML = '';
    storyViewerTitle.textContent = story.title;
    let footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', closeStoryViewer);
    storyViewerContent.appendChild(closeButton);

    if (story.type === 'image') {
        const img = document.createElement('img');
        img.src = story.src;
        img.style.height = "100%"; // Maintain 9:16 aspect ratio
        img.style.maxWidth = "56.25vh"; // Ensures 9:16 ratio (9/16 = 0.5625)
        img.style.objectFit = "cover"; // Ensures it fits properly
        storyViewerContent.appendChild(img);
        updateProgressBar(5000, showNextStory);
    } else {
        const video = document.createElement('video');
        video.src = story.src;
        video.autoplay = true;
        video.controls = true;
        video.style.height = "100%"; // Maintain 9:16 aspect ratio
        video.style.maxWidth = "56.25vh";
        video.style.objectFit = "cover";
        storyViewerContent.appendChild(video);

        video.onloadedmetadata = () => {
            updateProgressBar(video.duration * 1000, showNextStory);
        };

        video.onended = showNextStory;
    }

    storyViewer.classList.add('active');
}

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