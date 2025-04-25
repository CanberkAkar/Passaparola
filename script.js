const letters = [..."ABCÇDEFGHIİJKLMNOÖPRSŞTUÜVYZ"];
const container = document.querySelector(".circle");
let currentIndex = 0;
let timeoutId = null;
let statuses = Array(letters.length).fill("none");

let mainTimerInterval = null;
let remainingSeconds = 240;

function createLetters() {
  const radius = 220;
  const centerX = 300;
  const centerY = 300;

  letters.forEach((letter, index) => {
    const angle = (index / letters.length) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle) - 30;
    const y = centerY + radius * Math.sin(angle) - 30;

    const div = document.createElement("div");
    div.className = "letter";
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.textContent = letter;
    div.dataset.index = index;

    div.addEventListener("click", () => {
      currentIndex = index;
    });

    container.appendChild(div);
  });

  updateStats();
  updateMainTimerDisplay(); // Süreyi "04:00" olarak ayarla
}

// function markLetter(status) {
//   clearTimeout(timeoutId);
//   const letterDivs = document.querySelectorAll(".letter");
//   const current = letterDivs[currentIndex];

//   if (current) {
//     const currentStatus = statuses[currentIndex];
//     if (currentStatus === "success" || currentStatus === "fail") return;
//     if (currentStatus !== "none" && status === "none") return;

//     current.classList.remove("success", "fail", "pass", "timeout");
//     current.classList.add(status);
//     statuses[currentIndex] = status;
//   }

//   currentIndex++;
//   updateStats();

//   if (currentIndex < letters.length) {
//     startLetterTimeout();
//   }
// }

function markLetter(status) {
  const letterDivs = document.querySelectorAll(".letter");
  const current = letterDivs[currentIndex];

  if (current && statuses[currentIndex] === "none") {
    current.classList.remove("blinking");
    current.classList.add(status);
    statuses[currentIndex] = status;

    currentIndex++;
    updateStats();

    if (currentIndex < letters.length) {
      startBlinkingLetter(); // sıradaki harf yanmaya başlar
    }
  }
}

function startLetterTimeout() {
  timeoutId = setTimeout(() => {
    markLetter("timeout");
  }, 5000);
}

function updateMainTimerDisplay() {
  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");
  document.getElementById("main-timer").textContent = `${minutes}:${seconds}`;
}

// function startMainTimer() {
//   if (mainTimerInterval !== null) return; // zaten çalışıyor

//   mainTimerInterval = setInterval(() => {
//     if (remainingSeconds > 0) {
//       remainingSeconds--;
//       updateMainTimerDisplay();
//     } else {
//       clearInterval(mainTimerInterval);
//       mainTimerInterval = null;
//       document.getElementById("main-timer").textContent = "Süre Bitti!";
//     }
//   }, 1000);

//   startLetterTimeout();
// }

// function stopMainTimer() {
//   clearInterval(mainTimerInterval);
//   mainTimerInterval = null;

//   clearTimeout(timeoutId);
// }
let isTimerRunning = false;
let totalSeconds = 240;
function toggleTimer() {
  const timerButton = document.getElementById("toggle-button");

  if (!isTimerRunning) {
    startBlinkingLetter();
    mainTimerInterval = setInterval(() => {
      const timerDisplay = document.getElementById("main-timer");
      const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
      const seconds = String(totalSeconds % 60).padStart(2, "0");
      timerDisplay.textContent = `${minutes}:${seconds}`;
      totalSeconds--;

      if (totalSeconds < 0) {
        clearInterval(mainTimerInterval);
        mainTimerInterval = null;
        timerDisplay.textContent = "Süre Bitti!";
        isTimerRunning = false;
        timerButton.textContent = "Başlat";
      }
    }, 1000);

    isTimerRunning = true;
    timerButton.textContent = "Durdur";
    startBlinkingLetter();
  } else {
    clearInterval(mainTimerInterval);
    mainTimerInterval = null;
    isTimerRunning = false;
    document.getElementById("toggle-button").textContent = "Başlat";
  }
}

function resetGame() {
  clearInterval(mainTimerInterval);
  mainTimerInterval = null;
  totalSeconds = 240;
  isTimerRunning = false;

  statuses = Array(letters.length).fill("none");
  currentIndex = 0;

  const letterDivs = document.querySelectorAll(".letter");
  letterDivs.forEach((div) => {
    div.classList.remove("success", "fail", "pass", "timeout");
  });

  document.getElementById("main-timer").textContent = "04:00";
  document.getElementById("toggle-button").textContent = "Başlat";

  // İstatistikleri sıfırla
  document.getElementById("stat-success").textContent = "0";
  document.getElementById("stat-fail").textContent = "0";
  document.getElementById("stat-pass").textContent = "0";
  document.getElementById("stat-timeout").textContent = "0";
  startBlinkingLetter();
}

// function resetGame() {
//   stopMainTimer();

//   remainingSeconds = 240;
//   updateMainTimerDisplay();

//   statuses = Array(letters.length).fill("none");
//   currentIndex = 0;

//   const letterDivs = document.querySelectorAll(".letter");
//   letterDivs.forEach((div) => {
//     div.classList.remove("success", "fail", "pass", "timeout");
//   });

//   document.getElementById("stat-success").textContent = "0";
//   document.getElementById("stat-fail").textContent = "0";
//   document.getElementById("stat-pass").textContent = "0";
//   document.getElementById("stat-timeout").textContent = "0";
// }

function updateStats() {
  const stats = {
    success: 0,
    fail: 0,
    pass: 0,
    timeout: 0,
  };

  statuses.forEach((status) => {
    if (stats[status] !== undefined) {
      stats[status]++;
    }
  });

  document.getElementById("stat-success").textContent = stats.success;
  document.getElementById("stat-fail").textContent = stats.fail;
  document.getElementById("stat-pass").textContent = stats.pass;
  document.getElementById("stat-timeout").textContent = stats.timeout;
}

window.onload = createLetters;

function startBlinkingLetter() {
  const letterDivs = document.querySelectorAll(".letter");
  letterDivs.forEach((div) => div.classList.remove("blinking"));

  const current = letterDivs[currentIndex];
  if (current) {
    current.classList.add("blinking");
  }
}
