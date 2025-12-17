// Configuration
const CONFIG = {
  // Personalized messages
  userName: localStorage.getItem("romanticUserName") || "",

  // Message categories and content
  messages: [
    {
      category: "💬 Lyrics",
      text: "zara paas tu aa mere",
    },
    {
      category: "💬 Lyrics",
      text: "Deere se choo ja mujhe",
    },
    {
      category: "💌 Love Lines",
      text: "Kho jaau tere pyaar mein",
    },
    {
      category: "🌙 Promises",
      text: "Baahon me bhar le mujhe",
    },
    {
      category: "📝 Final Letter",
      text: "Forever yours, my love ❤️",
    },
  ],

  // Secret messages (Easter eggs)
  secretMessages: [
    "Love is not just a feeling, it's a promise.",
    "In your eyes, I found my home.",
    "Every moment with you is a treasure.",
    "You are the missing piece I never knew I needed.",
    "My heart beats only for you.",
  ],

  // Timing configurations
  introDelays: {
    firstText: 500,
    secondText: 2500,
    button: 4500,
  },
  typewriterSpeed: 60,
  messageInterval: 2000,
  heartCount: 20,

  // Audio settings (removed volume control)
  audioVolume: 0.5,

  // Easter egg settings
  heartClickTarget: 10,
  loveWord: "love",

  // Fireworks settings
  fireworks: {
    count: 150,
    speed: 3,
    gravity: 0.1,
    friction: 0.97,
  },
};

// DOM Elements (removed music and share controls)
const elements = {
  // Screens
  loadingScreen: document.getElementById("loading-screen"),
  nameScreen: document.getElementById("name-screen"),
  introScreen: document.getElementById("intro-screen"),
  messageScreen: document.getElementById("message-screen"),
  secretScreen: document.getElementById("secret-screen"),
  questionScreen: document.getElementById("question-screen"),
  gifScreen: document.getElementById("gif-screen"),
  letterScreen: document.getElementById("letter-screen"),

  // Intro screen
  introText1: document.getElementById("intro-text-1"),
  introText2: document.getElementById("intro-text-2"), // Fixed: This is the personalized text element
  openBtn: document.getElementById("open-btn"),

  // Name screen
  nameInput: document.getElementById("user-name-input"),
  confirmNameBtn: document.getElementById("confirm-name-btn"),

  // Message screen
  currentMessage: document.getElementById("current-message"),
  messageCategory: document.getElementById("message-category"),
  messageCount: document.getElementById("message-count"),
  progressDots: document.getElementById("progress-dots"),

  // Secret screen
  secretMessage: document.getElementById("secret-message"),
  secretContinueBtn: document.getElementById("secret-continue-btn"),

  // Question screen
  questionText: document.getElementById("question-text"),
  yesBtn: document.getElementById("yes-btn"),
  noBtn: document.getElementById("no-btn"),
  fireworks: document.getElementById("fireworks"),

  // GIF screen
  romanticGif: document.getElementById("romantic-gif"),
  finalCaption: document.getElementById("final-caption"),

  // Letter screen
  letterName: document.getElementById("letter-name"),
  letterDate: document.getElementById("letter-date"),
  letterText1: document.getElementById("letter-text-1"),
  letterText2: document.getElementById("letter-text-2"),
  letterText3: document.getElementById("letter-text-3"),
  restartBtn: document.getElementById("restart-btn"),

  // Audio elements
  backgroundMusic: document.getElementById("background-music"),
  clickSound: document.getElementById("click-sound"),
  typewriterSound: document.getElementById("typewriter-sound"),

  // Containers
  floatingHearts: document.getElementById("floating-hearts"),
  clickHeartsContainer: document.getElementById("click-hearts-container"),
  fireworksCanvas: document.getElementById("fireworks-canvas"),

  // Toast
  toast: document.getElementById("toast"),
  toastMessage: document.getElementById("toast-message"),

  // Accessibility controls
  reduceMotionBtn: document.getElementById("reduce-motion-btn"),
};

// State Management
const state = {
  currentMessageIndex: 0,
  isMusicPlaying: false,
  isTransitioning: false,
  musicStarted: false,
  isTyping: false,
  typewriterTimeout: null,
  allMessagesCompleted: false,
  messageTimeouts: [],
  heartClickCount: 0,
  secretFound: false,
  loveWordBuffer: "",
  isReducedMotion: false,
  userName: CONFIG.userName,
  isNameSet: false,
  longPressTimer: null,
  canvasContext: null,
  fireworksParticles: [],
};

// Initialize
function init() {
  console.log("Initializing...");
  console.log("Current user name:", state.userName);

  // Setup canvas
  setupCanvas();

  // Setup all event listeners
  setupEventListeners();
  setupAccessibility();
  setupEasterEggs();

  // Create floating hearts
  createFloatingHearts();

  // Check if name is set
  if (!state.userName || state.userName.trim() === "") {
    console.log("No name found, showing name screen");
    state.isNameSet = false;
    showScreen("name-screen");
    setupNameScreen();
  } else {
    console.log("Name found:", state.userName);
    state.isNameSet = true;
    showScreen("loading-screen");

    // Hide loading screen after a delay and show intro
    setTimeout(() => {
      elements.loadingScreen.classList.remove("active");
      setTimeout(() => {
        elements.loadingScreen.style.display = "none";
        showScreen("intro-screen");
        startIntroSequence();
      }, 800);
    }, 2000);
  }
}

// Screen Management
function showScreen(screenId) {
  console.log("Showing screen:", screenId);

  const allScreens = document.querySelectorAll(".screen");
  allScreens.forEach((screen) => {
    if (screen.classList.contains("active")) {
      screen.classList.remove("active");
    }
    screen.style.display = "none";
  });

  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.style.display = "flex";
    setTimeout(() => {
      targetScreen.classList.add("active");
    }, 50);
  }
}

// Name Screen
function setupNameScreen() {
  console.log("Setting up name screen");

  // Focus on input
  setTimeout(() => {
    if (elements.nameInput) {
      elements.nameInput.focus();
    }
  }, 500);

  // Input validation
  if (elements.nameInput) {
    elements.nameInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    });
  }

  // Confirm button click
  if (elements.confirmNameBtn) {
    elements.confirmNameBtn.addEventListener("click", saveUserName);
  }

  // Enter key press
  if (elements.nameInput) {
    elements.nameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        saveUserName();
      }
    });
  }
}

function saveUserName() {
  console.log("Saving user name...");

  if (!elements.nameInput) {
    console.error("Name input element not found");
    return;
  }

  const name = elements.nameInput.value.trim();
  console.log("Name entered:", name);

  if (name.length >= 2 && name.length <= 20) {
    state.userName = name;
    CONFIG.userName = name;
    localStorage.setItem("romanticUserName", name);
    state.isNameSet = true;

    showToast("Name saved! ❤️");
    console.log("Name saved successfully");

    // Show loading screen briefly before intro
    showScreen("loading-screen");

    setTimeout(() => {
      elements.loadingScreen.classList.remove("active");
      setTimeout(() => {
        elements.loadingScreen.style.display = "none";
        showScreen("intro-screen");
        startIntroSequence();
      }, 800);
    }, 1500);
  } else {
    showToast("Please enter a name (2-20 characters)");
    console.log("Invalid name length:", name.length);
  }
}

// Intro Sequence - FIXED VERSION
function startIntroSequence() {
  console.log("Starting intro sequence for:", state.userName);

  // Reset all intro elements first
  elements.introText1.classList.remove("show");
  elements.introText2.classList.add("hidden");
  elements.introText2.classList.remove("show");
  elements.openBtn.classList.add("hidden");
  elements.openBtn.classList.remove("show");

  // Clear the text first
  elements.introText2.textContent = "";

  // Set personalized text with a small delay
  setTimeout(() => {
    elements.introText2.textContent = `This is for you, ${state.userName} ❤️`;
  }, 100);

  // Animate intro texts with delays
  setTimeout(() => {
    elements.introText1.classList.add("show");
    console.log("Showing intro text 1");
  }, CONFIG.introDelays.firstText);

  setTimeout(() => {
    // First remove hidden class, then add show class
    elements.introText2.classList.remove("hidden");
    // Small delay before adding show class for smooth transition
    setTimeout(() => {
      elements.introText2.classList.add("show");
      console.log(
        "Showing intro text 2 (personalized):",
        elements.introText2.textContent
      );
    }, 100);
  }, CONFIG.introDelays.secondText);

  setTimeout(() => {
    elements.openBtn.classList.remove("hidden");
    // Small delay before adding show class
    setTimeout(() => {
      elements.openBtn.classList.add("show");
      console.log("Showing open button");
    }, 100);
  }, CONFIG.introDelays.button);
}

// Message System
function createProgressDots() {
  elements.progressDots.innerHTML = "";
  CONFIG.messages.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = "progress-dot";
    if (index === 0) dot.classList.add("active");
    elements.progressDots.appendChild(dot);
  });
}

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
    elements.messageCategory.textContent = CONFIG.messages[index].category;
    elements.messageCount.textContent = `${index + 1}/${
      CONFIG.messages.length
    }`;

    state.isTyping = true;
    typeWriterEffect(CONFIG.messages[index].text, elements.currentMessage);
    elements.currentMessage.classList.add("show");

    updateProgressDots(index);

    const typingDuration = getTypingDuration(CONFIG.messages[index].text);

    if (index === CONFIG.messages.length - 1) {
      const timeout = setTimeout(() => {
        showQuestionScreen();
        state.allMessagesCompleted = true;
      }, typingDuration + 1000);
      state.messageTimeouts.push(timeout);
    } else {
      const timeout = setTimeout(() => {
        showMessage(index + 1);
      }, typingDuration + CONFIG.messageInterval);
      state.messageTimeouts.push(timeout);
    }
  }, 300);
}

function typeWriterEffect(text, element, index = 0) {
  if (index < text.length) {
    if (index === 0) {
      element.classList.add("typing");
    }

    element.textContent = text.substring(0, index + 1);

    // Play typewriter sound occasionally
    if (index % 3 === 0) {
      playSound(elements.typewriterSound, 0.1);
    }

    state.typewriterTimeout = setTimeout(() => {
      typeWriterEffect(text, element, index + 1);
    }, CONFIG.typewriterSpeed);
  } else {
    element.classList.remove("typing");
    element.classList.add("typed");
    state.isTyping = false;
  }
}

function getTypingDuration(message) {
  return message.length * CONFIG.typewriterSpeed;
}

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

// Question Screen
function showQuestionScreen() {
  elements.questionText.textContent = `Will you always stay with me, ${state.userName}? ❤️`;
  showScreen("question-screen");
  setupQuestionButtons();
}

function setupQuestionButtons() {
  let noClickCount = 0;
  const maxRunAway = 3;

  // Remove existing event listeners to prevent duplicates
  const newYesBtn = elements.yesBtn.cloneNode(true);
  elements.yesBtn.parentNode.replaceChild(newYesBtn, elements.yesBtn);
  elements.yesBtn = newYesBtn;

  const newNoBtn = elements.noBtn.cloneNode(true);
  elements.noBtn.parentNode.replaceChild(newNoBtn, elements.noBtn);
  elements.noBtn = newNoBtn;

  elements.yesBtn.addEventListener("click", () => {
    startFireworks();
    showToast("You made me the happiest person! ❤️");

    setTimeout(() => {
      showGifScreen();
    }, 3000);
  });

  elements.noBtn.addEventListener("click", (e) => {
    noClickCount++;

    if (noClickCount >= maxRunAway) {
      e.target.style.display = "none";
      showToast("I'll keep trying anyway! 💔");
      setTimeout(() => {
        elements.noBtn.style.display = "flex";
        noClickCount = 0;
      }, 2000);
      return;
    }

    const buttonRect = e.target.getBoundingClientRect();
    const maxX = window.innerWidth - buttonRect.width;
    const maxY = window.innerHeight - buttonRect.height;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    e.target.style.position = "fixed";
    e.target.style.left = `${randomX}px`;
    e.target.style.top = `${randomY}px`;
    e.target.style.transform = "none";

    showToast("You can't escape love that easily! 😉");
  });
}

// GIF Screen
function showGifScreen() {
  elements.finalCaption.textContent = `Forever Yours, ${state.userName} ❤️`;
  showScreen("gif-screen");

  setTimeout(() => {
    showLetterScreen();
  }, 5000);
}

// Letter Screen
function showLetterScreen() {
  elements.letterName.textContent = state.userName;

  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  elements.letterDate.textContent = today.toLocaleDateString("en-US", options);

  elements.letterText1.textContent = `My dearest ${state.userName}, from the moment our paths crossed, my life has been illuminated with a joy I never knew existed.`;
  elements.letterText2.textContent = `Every word I've shared, every message in this journey, comes from the deepest corners of my heart. You are my today, my tomorrow, and all my forever's.`;
  elements.letterText3.textContent = `This digital letter may fade, but my love for you will only grow stronger with each passing day. Thank you for being you, and for letting me love you.`;

  showScreen("letter-screen");
}

// Secret/Easter Eggs
function setupEasterEggs() {
  // Love word typing
  document.addEventListener("keydown", (e) => {
    state.loveWordBuffer += e.key.toLowerCase();
    if (state.loveWordBuffer.length > CONFIG.loveWord.length) {
      state.loveWordBuffer = state.loveWordBuffer.slice(
        -CONFIG.loveWord.length
      );
    }

    if (state.loveWordBuffer === CONFIG.loveWord) {
      showSecretMessage();
      state.loveWordBuffer = "";
    }
  });

  // Long press detection
  document.addEventListener("mousedown", startLongPress);
  document.addEventListener("touchstart", startLongPress);
  document.addEventListener("mouseup", cancelLongPress);
  document.addEventListener("touchend", cancelLongPress);
  document.addEventListener("touchcancel", cancelLongPress);
}

function startLongPress(e) {
  state.longPressTimer = setTimeout(() => {
    showSecretMessage();
  }, 3000);
}

function cancelLongPress() {
  clearTimeout(state.longPressTimer);
}

function showSecretMessage() {
  if (state.secretFound) return;

  const randomMessage =
    CONFIG.secretMessages[
      Math.floor(Math.random() * CONFIG.secretMessages.length)
    ];

  elements.secretMessage.textContent = randomMessage;
  showScreen("secret-screen");
  state.secretFound = true;

  // Remove existing event listeners
  const newBtn = elements.secretContinueBtn.cloneNode(true);
  elements.secretContinueBtn.parentNode.replaceChild(
    newBtn,
    elements.secretContinueBtn
  );
  elements.secretContinueBtn = newBtn;

  elements.secretContinueBtn.addEventListener("click", () => {
    // Go back to whichever screen was active before secret screen
    if (state.allMessagesCompleted) {
      showScreen("question-screen");
    } else {
      showScreen("message-screen");
      showMessage(state.currentMessageIndex);
    }
  });
}

// Heart Interactions
function createFloatingHearts() {
  elements.floatingHearts.innerHTML = "";
  for (let i = 0; i < CONFIG.heartCount; i++) {
    setTimeout(() => {
      createHeart(true);
    }, i * 100);
  }
}

function createHeart(isFloating = false, x = null, y = null) {
  const heart = document.createElement("div");
  heart.className = isFloating ? "floating-heart" : "click-heart";
  heart.innerHTML = '<i class="fas fa-heart"></i>';

  if (isFloating) {
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
  } else {
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${Math.random() * 20 + 20}px`;

    elements.clickHeartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1000);

    state.heartClickCount++;

    if (
      state.heartClickCount >= CONFIG.heartClickTarget &&
      !state.secretFound
    ) {
      showSecretMessage();
    }
  }
}

// Fireworks
function setupCanvas() {
  elements.fireworksCanvas.width = window.innerWidth;
  elements.fireworksCanvas.height = window.innerHeight;
  state.canvasContext = elements.fireworksCanvas.getContext("2d");

  window.addEventListener("resize", () => {
    elements.fireworksCanvas.width = window.innerWidth;
    elements.fireworksCanvas.height = window.innerHeight;
  });
}

function startFireworks() {
  for (let i = 0; i < CONFIG.fireworks.count; i++) {
    createFireworkParticle();
  }

  animateFireworks();
}

function createFireworkParticle() {
  const particle = {
    x: Math.random() * elements.fireworksCanvas.width,
    y: elements.fireworksCanvas.height,
    vx: (Math.random() - 0.5) * CONFIG.fireworks.speed * 2,
    vy: -Math.random() * CONFIG.fireworks.speed - 2,
    color: `hsl(${Math.random() * 360}, 100%, 60%)`,
    size: Math.random() * 3 + 1,
    gravity: CONFIG.fireworks.gravity,
    friction: CONFIG.fireworks.friction,
    alpha: 1,
  };

  state.fireworksParticles.push(particle);
}

function animateFireworks() {
  if (state.fireworksParticles.length === 0) return;

  state.canvasContext.clearRect(
    0,
    0,
    elements.fireworksCanvas.width,
    elements.fireworksCanvas.height
  );

  for (let i = state.fireworksParticles.length - 1; i >= 0; i--) {
    const p = state.fireworksParticles[i];

    p.vy += p.gravity;
    p.vx *= p.friction;
    p.vy *= p.friction;

    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.005;

    state.canvasContext.globalAlpha = p.alpha;
    state.canvasContext.fillStyle = p.color;
    state.canvasContext.beginPath();
    state.canvasContext.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    state.canvasContext.fill();

    if (p.alpha <= 0) {
      state.fireworksParticles.splice(i, 1);
    }
  }

  if (Math.random() < 0.05) {
    createFireworkParticle();
  }

  requestAnimationFrame(animateFireworks);
}

// Audio Functions (simplified)
function playSound(audioElement, volume = 0.5) {
  if (audioElement) {
    audioElement.volume = volume;
    audioElement.currentTime = 0;
    audioElement.play().catch(() => {});
  }
}

// Accessibility
function setupAccessibility() {
  if (elements.reduceMotionBtn) {
    elements.reduceMotionBtn.addEventListener("click", toggleReducedMotion);
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (elements.openBtn && elements.openBtn.classList.contains("show")) {
        openMessage();
      }
    }

    if (e.key === "Escape" && state.allMessagesCompleted) {
      restartExperience();
    }
  });
}

function toggleReducedMotion() {
  state.isReducedMotion = !state.isReducedMotion;
  document.body.classList.toggle("reduce-motion", state.isReducedMotion);
  if (elements.reduceMotionBtn) {
    elements.reduceMotionBtn.classList.toggle("active", state.isReducedMotion);
  }
  showToast(
    state.isReducedMotion ? "Reduced motion enabled" : "Reduced motion disabled"
  );
}

// Event Listeners
function setupEventListeners() {
  console.log("Setting up event listeners");

  // Open button
  if (elements.openBtn) {
    elements.openBtn.addEventListener("click", openMessage);
  }

  // Restart button
  if (elements.restartBtn) {
    elements.restartBtn.addEventListener("click", restartExperience);
  }

  // Click anywhere for hearts
  document.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;

    createHeart(false, e.clientX, e.clientY);
    playSound(elements.clickSound, 0.3);
  });

  // Progress dots navigation
  if (elements.progressDots) {
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
}

// Open Message
function openMessage() {
  if (state.isTransitioning) return;

  state.isTransitioning = true;

  // Start background music automatically
  if (!state.musicStarted && elements.backgroundMusic) {
    elements.backgroundMusic.volume = CONFIG.audioVolume;
    elements.backgroundMusic
      .play()
      .then(() => {
        state.isMusicPlaying = true;
        state.musicStarted = true;
      })
      .catch(() => {
        state.musicStarted = true;
      });
  }

  // Transition to message screen
  elements.introScreen.classList.remove("active");
  setTimeout(() => {
    elements.introScreen.style.display = "none";
    elements.messageScreen.style.display = "flex";
    setTimeout(() => {
      elements.messageScreen.classList.add("active");
      createProgressDots();
      showMessage(0);
      state.isTransitioning = false;
    }, 100);
  }, 800);
}

// Toast Notification
function showToast(message) {
  if (!elements.toast || !elements.toastMessage) return;

  elements.toastMessage.textContent = message;
  elements.toast.classList.add("show");

  setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 3000);
}

// Restart Experience
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
  state.heartClickCount = 0;
  state.secretFound = false;
  state.loveWordBuffer = "";

  // Reset audio
  if (elements.backgroundMusic) {
    elements.backgroundMusic.pause();
    elements.backgroundMusic.currentTime = 0;
    state.isMusicPlaying = false;
    state.musicStarted = false;
  }

  // Clear fireworks
  state.fireworksParticles = [];
  if (state.canvasContext) {
    state.canvasContext.clearRect(
      0,
      0,
      elements.fireworksCanvas.width,
      elements.fireworksCanvas.height
    );
  }

  // Clear localStorage to force name input again
  localStorage.removeItem("romanticUserName");
  state.userName = "";
  state.isNameSet = false;

  // Show name screen again
  showScreen("name-screen");
  setupNameScreen();

  state.isTransitioning = false;
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
