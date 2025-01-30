const storiesContainer = document.getElementById('storiesContainer');
const storyViewer = document.getElementById('storyViewer');
const storyViewerContent = document.getElementById('storyViewerContent');
const storyViewerTitle = document.getElementById('storyViewerTitle');
const progressBar = document.getElementById('progressBar');

let storyQueue = [];
let currentStoryIndex = 0;
let progressTimeout;

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
            if (video.duration > 0) {
                updateProgressBar(video.duration * 1000, () => showNextStory(index));
            }
        };

        video.onended = () => {
            showNextStory(index);
        };
    }

    storyViewer.classList.add('active');
}



function showNextStory(index) {
    if (index + 1 < storyQueue.length) {
        showStory(index + 1);
    } else {
        closeStoryViewer();
    }
}

function closeStoryViewer() {
    storyViewer.classList.remove('active');
    clearTimeout(progressTimeout);

    // Stop any playing video
    const video = storyViewerContent.querySelector('video');
    if (video) {
        video.pause();
        video.src = ""; // Remove source to stop loading
        video.load(); // Force reload to clear cache
    }

    // Clear the content to prevent playback persistence
    storyViewerContent.innerHTML = '';

    // Show footer again
    let footer = document.querySelector("footer");
    if (footer) {
        footer.style.display = "block";
    }
}


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

/*remove*/


const stories = document.querySelector(".stories");
const storiesFullView = document.querySelector(".stories-full-view");
const closeBtn = document.querySelector(".close-btn");
const storyImageFull = document.querySelector(".stories-full-view .story img");
const storyAuthorFull = document.querySelector(
  ".stories-full-view .story .author"
);
const nextBtn = document.querySelector(".stories-container .next-btn");
const previousBtn = document.querySelector(".stories-container .previous-btn");
const storiesContent = document.querySelector(".stories-container .content");
const nextBtnFull = document.querySelector(".stories-full-view .next-btn");
const previousBtnFull = document.querySelector(
  ".stories-full-view .previous-btn"
);

let currentActive = 0;

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

    stories.appendChild(story);

    story.addEventListener("click", () => {
      showFullView(i);
    });
  });
};

createStories();

const showFullView = (index) => {
  currentActive = index;
  updateFullView();
  storiesFullView.classList.add("active");
};

closeBtn.addEventListener("click", () => {
  storiesFullView.classList.remove("active");
});

const updateFullView = () => {
  storyImageFull.src = allStories[currentActive].imageUrl;
  storyAuthorFull.innerHTML = allStories[currentActive].author;
};

nextBtn.addEventListener("click", () => {
  storiesContent.scrollLeft += 300;
});

previousBtn.addEventListener("click", () => {
  storiesContent.scrollLeft -= 300;
});

storiesContent.addEventListener("scroll", () => {
  if (storiesContent.scrollLeft <= 24) {
    previousBtn.classList.remove("active");
  } else {
    previousBtn.classList.add("active");
  }

  let maxScrollValue =
    storiesContent.scrollWidth - storiesContent.clientWidth - 24;

  if (storiesContent.scrollLeft >= maxScrollValue) {
    nextBtn.classList.remove("active");
  } else {
    nextBtn.classList.add("active");
  }
});

nextBtnFull.addEventListener("click", () => {
  if (currentActive >= allStories.length - 1) {
    return;
  }
  currentActive++;
  updateFullView();
});

previousBtnFull.addEventListener("click", () => {
  if (currentActive <= 0) {
    return;
  }
  currentActive--;
  updateFullView();
});
