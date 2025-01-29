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
