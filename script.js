// Configuration
const CONFIG = {
  messages: [
    "zara paas tu aa mere",
    "Deere se choo ja mujhe",
    "Kho jaau tere pyaar mein",
    "Baahon me bhar le mujhe",
  ],
  introDelays: {
    firstText: 500,
    secondText: 2500,
    button: 4500,
  },
  typewriterSpeed: 60,
  messageInterval: 2000,
  heartCount: 20,
};

// DOM Elements
const elements = {
  introScreen: document.getElementById("intro-screen"),
  messageScreen: document.getElementById("message-screen"),
  gifScreen: document.getElementById("gif-screen"),
  introText1: document.getElementById("intro-text-1"),
  introText2: document.getElementById("intro-text-2"),
  openBtn: document.getElementById("open-btn"),
  currentMessage: document.getElementById("current-message"),
  progressDots: document.getElementById("progress-dots"),
  restartBtn: document.getElementById("restart-btn"),
  backgroundMusic: document.getElementById("background-music"),
  floatingHearts: document.getElementById("floating-hearts"),
};

// State
let state = {
  currentMessageIndex: 0,
  isMusicPlaying: false,
  isTransitioning: false,
  musicStarted: false,
  isTyping: false,
  typewriterTimeout: null,
  allMessagesCompleted: false,
  messageTimeouts: [],
};

// Initialize
function init() {
  createFloatingHearts();
  startIntroSequence();
  setupEventListeners();
  createProgressDots();
}

// Create floating hearts
function createFloatingHearts() {
  elements.floatingHearts.innerHTML = "";
  for (let i = 0; i < CONFIG.heartCount; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.innerHTML = '<i class="fas fa-heart"></i>';

      const left = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      const size = Math.random() * 15 + 8;
      const opacity = Math.random() * 0.2 + 0.05;

      heart.style.left = `${left}%`;
      heart.style.animationDuration = `${duration}s`;
      heart.style.animationDelay = `${delay}s`;
      heart.style.fontSize = `${size}px`;
      heart.style.opacity = opacity;
      heart.style.color = `rgba(255, 51, 102, ${opacity})`;

      elements.floatingHearts.appendChild(heart);
    }, i * 100);
  }
}

// Start intro sequence
function startIntroSequence() {
  setTimeout(() => {
    elements.introText1.classList.add("show");
  }, CONFIG.introDelays.firstText);

  setTimeout(() => {
    elements.introText2.classList.remove("hidden");
    elements.introText2.classList.add("show");
  }, CONFIG.introDelays.secondText);

  setTimeout(() => {
    elements.openBtn.classList.remove("hidden");
    elements.openBtn.classList.add("show");
  }, CONFIG.introDelays.button);
}

// Setup event listeners
function setupEventListeners() {
  elements.openBtn.addEventListener("click", openMessage);
  elements.restartBtn.addEventListener("click", restartExperience);

  elements.progressDots.addEventListener("click", (e) => {
    if (e.target.classList.contains("progress-dot")) {
      const index = Array.from(elements.progressDots.children).indexOf(
        e.target
      );
      if (index >= 0 && index < CONFIG.messages.length) {
        if (state.isTyping) {
          clearTimeout(state.typewriterTimeout);
          state.isTyping = false;
        }
        state.messageTimeouts.forEach((timeout) => clearTimeout(timeout));
        state.messageTimeouts = [];

        showMessage(index);
      }
    }
  });
}

// Create progress dots
function createProgressDots() {
  elements.progressDots.innerHTML = "";
  CONFIG.messages.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = "progress-dot";
    if (index === 0) dot.classList.add("active");
    elements.progressDots.appendChild(dot);
  });
}

// Open message screen
function openMessage() {
  if (state.isTransitioning) return;

  state.isTransitioning = true;

  // Start music
  startMusic();

  // Center transition
  elements.introScreen.classList.remove("active");
  setTimeout(() => {
    elements.introScreen.style.display = "none";
    elements.messageScreen.style.display = "flex";
    setTimeout(() => {
      elements.messageScreen.classList.add("active");
      showMessage(0);
      state.isTransitioning = false;
    }, 100);
  }, 800);
}

// Start background music
function startMusic() {
  if (!state.musicStarted) {
    elements.backgroundMusic.volume = 0.5;
    elements.backgroundMusic
      .play()
      .then(() => {
        state.isMusicPlaying = true;
        state.musicStarted = true;
      })
      .catch((error) => {
        console.log("Audio play failed:", error);
        state.musicStarted = true;
      });
  }
}

// Typewriter effect
function typeWriterEffect(text, element, index = 0) {
  if (index < text.length) {
    if (index === 0) {
      element.classList.add("typing");
    }

    element.textContent = text.substring(0, index + 1);
    state.typewriterTimeout = setTimeout(() => {
      typeWriterEffect(text, element, index + 1);
    }, CONFIG.typewriterSpeed);
  } else {
    element.classList.remove("typing");
    element.classList.add("typed");
    state.isTyping = false;
  }
}

// Calculate typing duration
function getTypingDuration(message) {
  return message.length * CONFIG.typewriterSpeed;
}

// Show specific message
function showMessage(index) {
  if (index < 0 || index >= CONFIG.messages.length) return;

  state.currentMessageIndex = index;

  if (state.isTyping) {
    clearTimeout(state.typewriterTimeout);
    state.isTyping = false;
  }

  elements.currentMessage.classList.remove("typing", "typed", "show");

  setTimeout(() => {
    elements.currentMessage.textContent = "";
    state.isTyping = true;
    typeWriterEffect(CONFIG.messages[index], elements.currentMessage);
    elements.currentMessage.classList.add("show");

    updateProgressDots(index);

    const typingDuration = getTypingDuration(CONFIG.messages[index]);

    // If last message
    if (index === CONFIG.messages.length - 1) {
      const timeout = setTimeout(() => {
        showGifScreen();
        state.allMessagesCompleted = true;
      }, typingDuration + 1000);

      state.messageTimeouts.push(timeout);
    }
    // Auto-advance
    else {
      const timeout = setTimeout(() => {
        showMessage(index + 1);
      }, typingDuration + CONFIG.messageInterval);

      state.messageTimeouts.push(timeout);
    }
  }, 300);
}

// Show GIF screen (centered)
function showGifScreen() {
  state.isTransitioning = true;

  elements.messageScreen.classList.remove("active");

  setTimeout(() => {
    elements.messageScreen.style.display = "none";

    // Show GIF screen centered
    elements.gifScreen.style.display = "flex";
    setTimeout(() => {
      elements.gifScreen.classList.add("active");

      // Celebration hearts
      createFloatingHearts();
      createAdditionalHearts();

      state.isTransitioning = false;
    }, 100);
  }, 800);
}

// Create additional hearts for celebration
function createAdditionalHearts() {
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.innerHTML = '<i class="fas fa-heart"></i>';

      const left = Math.random() * 100;
      const duration = Math.random() * 8 + 4;
      const size = Math.random() * 25 + 15;
      const opacity = Math.random() * 0.3 + 0.2;

      heart.style.left = `${left}%`;
      heart.style.animationDuration = `${duration}s`;
      heart.style.fontSize = `${size}px`;
      heart.style.opacity = opacity;
      heart.style.color = `rgba(255, 107, 149, ${opacity})`;

      elements.floatingHearts.appendChild(heart);
    }, i * 100);
  }
}

// Update progress dots
function updateProgressDots(activeIndex) {
  const dots = elements.progressDots.children;

  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active", "visited");

    if (i === activeIndex) {
      dots[i].classList.add("active");
    } else if (i < activeIndex) {
      dots[i].classList.add("visited");
    }
  }
}

// Restart experience
function restartExperience() {
  if (state.isTransitioning) return;

  // Clear all timeouts
  if (state.isTyping) {
    clearTimeout(state.typewriterTimeout);
    state.isTyping = false;
  }

  state.messageTimeouts.forEach((timeout) => clearTimeout(timeout));
  state.messageTimeouts = [];

  state.isTransitioning = true;
  state.allMessagesCompleted = false;

  // Reset music
  elements.backgroundMusic.pause();
  elements.backgroundMusic.currentTime = 0;
  state.isMusicPlaying = false;
  state.musicStarted = false;

  // Hide GIF screen
  elements.gifScreen.classList.remove("active");
  setTimeout(() => {
    elements.gifScreen.style.display = "none";

    // Show intro screen centered
    elements.introScreen.style.display = "flex";
    setTimeout(() => {
      elements.introScreen.classList.add("active");

      // Reset intro elements
      elements.introText1.classList.remove("show");
      elements.introText2.classList.add("hidden");
      elements.introText2.classList.remove("show");
      elements.openBtn.classList.add("hidden");
      elements.openBtn.classList.remove("show");

      // Reset message elements
      elements.currentMessage.classList.remove("show", "typing", "typed");
      elements.currentMessage.textContent = "";

      // Reset progress dots
      createProgressDots();

      // Reset floating hearts
      elements.floatingHearts.innerHTML = "";
      createFloatingHearts();

      // Restart intro sequence
      setTimeout(() => {
        startIntroSequence();
        state.isTransitioning = false;
        state.currentMessageIndex = 0;
      }, 300);
    }, 100);
  }, 800);
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);

// Handle visibility change
document.addEventListener("visibilitychange", () => {
  if (document.hidden && state.isMusicPlaying) {
    elements.backgroundMusic.pause();
    state.isMusicPlaying = false;
  } else if (!document.hidden && state.musicStarted && !state.isMusicPlaying) {
    elements.backgroundMusic
      .play()
      .then(() => {
        state.isMusicPlaying = true;
      })
      .catch(() => {
        // Auto-play might fail
      });
  }
});

// Touch device adjustments
if ("ontouchstart" in window) {
  document.body.classList.add("touch-device");
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.style.touchAction = "manipulation";
  });
}

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    if (
      elements.openBtn.classList.contains("show") &&
      elements.introScreen.classList.contains("active")
    ) {
      openMessage();
    }
  }

  if (e.key === "Escape" && state.allMessagesCompleted) {
    restartExperience();
  }
});
