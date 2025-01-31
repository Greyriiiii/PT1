const storiesContainer = document.getElementById('storiesContainer');
const storyViewer = document.getElementById('storyViewer');
const storyViewerContent = document.getElementById('storyViewerContent');
const storyViewerTitle = document.getElementById('storyViewerTitle');
const progressBar = document.getElementById('progressBar');

let storyQueue = [];
let currentStoryIndex = 0;
let progressTimeout;

const previousBtn = document.querySelector('.stories-container .previous-btn');
const nextBtn = document.querySelector('.stories-container .next-btn');

// Function to update the visibility of the previous and next buttons
function updateNavigationButtons() {
    const totalStories = storiesContainer.querySelectorAll('.story').length;
    const containerWidth = storiesContainer.offsetWidth;
    const storiesWidth = storiesContainer.scrollWidth;

    // Only show navigation buttons if there are more than one story and the total width exceeds the container width
    if (totalStories > 1 && storiesWidth > containerWidth) {
        previousBtn.style.display = storiesContainer.scrollLeft > 0 ? 'flex' : 'none';
        nextBtn.style.display = storiesContainer.scrollLeft < storiesWidth - containerWidth ? 'flex' : 'none';
    } else {
        previousBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }
}

// Function to show the next story
function showNextStory() {
    const stories = storiesContainer.querySelectorAll('.story');
    if (currentStoryIndex < stories.length - 1) {
        currentStoryIndex++;
        storiesContainer.scrollLeft = stories[currentStoryIndex].offsetLeft;
    }
    updateNavigationButtons();
}

// Function to show the previous story
function showPreviousStory() {
    const stories = storiesContainer.querySelectorAll('.story');
    if (currentStoryIndex > 0) {
        currentStoryIndex--;
        storiesContainer.scrollLeft = stories[currentStoryIndex].offsetLeft;
    }
    updateNavigationButtons();
}

// Event listeners for next and previous buttons
nextBtn.addEventListener('click', showNextStory);
previousBtn.addEventListener('click', showPreviousStory);

// Function to add stories
function addStories() {
    const mediaInput = document.getElementById('mediaInput');
    const storyTitleInput = document.getElementById('storyTitle');
    const files = Array.from(mediaInput.files);
    const storyTitle = storyTitleInput.value.trim() || "Untitled Story";

    if (files.length === 0) {
        alert('Please select at least one image or video.');
        return;
    }

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

    storyTitleInput.value = '';
    mediaInput.value = '';

    updateNavigationButtons(); // Update navigation buttons after stories are added
}

// Function to show a specific story
function showStory(index) {
    if (index < 0 || index >= storyQueue.length) {
        storyViewer.classList.remove('active');
        clearTimeout(progressTimeout);
        return;
    }

    const story = storyQueue[index];
    storyViewerContent.innerHTML = '';
    storyViewerTitle.textContent = story.title;

    // Hide footer when viewing stories
    let footer = document.querySelector("footer");
    if (footer) {
        footer.style.display = "none";
    }

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', closeStoryViewer);
    storyViewerContent.appendChild(closeButton);

    // Apply 9:16 aspect ratio
    storyViewerContent.style.display = "flex";
    storyViewerContent.style.justifyContent = "center";
    storyViewerContent.style.alignItems = "center";
    storyViewerContent.style.width = "100%";
    storyViewerContent.style.height = "100vh"; // Full screen height

    if (story.type === 'image') {
        const img = document.createElement('img');
        img.src = story.src;
        img.style.width = "auto";
        img.style.height = "100%"; // Maintain 9:16 aspect ratio
        img.style.maxWidth = "56.25vh"; // Ensures 9:16 ratio (9/16 = 0.5625)
        img.style.objectFit = "cover"; // Ensures it fits properly
        storyViewerContent.appendChild(img);
        updateProgressBar(5000, () => showNextStory(index));
    } else if (story.type === 'video') {
        const video = document.createElement('video');
        video.src = story.src;
        video.autoplay = true;
        video.controls = true;
        video.style.width = "auto";
        video.style.height = "100%"; // Maintain 9:16 aspect ratio
        video.style.maxWidth = "56.25vh"; // Ensures 9:16 ratio
        video.style.objectFit = "cover";
        storyViewerContent.appendChild(video);

        video.onloadedmetadata = () => {
            updateProgressBar(video.duration * 1000, () => showNextStory(index));
        };

        video.onended = () => {
            showNextStory(index);
        };
    }

    storyViewer.classList.add('active');
}

// Function to close story viewer
function closeStoryViewer() {
    storyViewer.classList.remove('active');
    clearTimeout(progressTimeout);

    // Stop any playing video
    const video = storyViewerContent.querySelector('video');
    if (video) {
        video.pause();
        video.currentTime = 0; // Reset to start
    }

    let footer = document.querySelector("footer");
    if (footer) footer.style.display = "block";
}

// Function to update the progress bar
function updateProgressBar(duration, callback) {
    progressBar.style.width = '0%';
    progressBar.style.transition = 'none';

    requestAnimationFrame(() => {
        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = '100%';

        progressTimeout = setTimeout(() => {
            if (typeof callback === 'function') {
                callback();
            }
        }, duration);
    });
}

// Create the initial stories when page loads or after upload
const createStories = () => {
  allStories.forEach((s, i) => {
    const story = document.createElement("div");
    story.classList.add("story");
    const img = document.createElement("img");
    img.src = s.imageUrl;
    const author = document.createElement("div");
    author.classList.add("author");
    author.innerHTML = s.author;

    story.appendChild(img);
    story.appendChild(author);

    storiesContainer.appendChild(story);

    story.addEventListener("click", () => {
      showFullView(i);
    });
  });

  updateNavigationButtons(); // Ensure buttons are updated after initial stories load
};

createStories();
