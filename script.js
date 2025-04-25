const letters = [..."ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ"];
const container = document.querySelector('.circle');
let currentIndex = 0;
let timeoutId = null;
let statuses = Array(letters.length).fill("none");

function createLetters() {
  const radius = 220;
  const centerX = 300;
  const centerY = 300;

  letters.forEach((letter, index) => {
    const angle = ((index / letters.length) * 2 * Math.PI) - (Math.PI / 2);
    const x = centerX + radius * Math.cos(angle) - 30;
    const y = centerY + radius * Math.sin(angle) - 30;

    const div = document.createElement('div');
    div.className = 'letter';
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.textContent = letter;
    div.dataset.index = index;

    div.addEventListener('click', () => {
      currentIndex = index;
    });

    container.appendChild(div);
  });

  updateStats();
  startTimer();
  startMainTimer();
}

function markLetter(status) {
  clearTimeout(timeoutId);
  const letterDivs = document.querySelectorAll('.letter');
  const current = letterDivs[currentIndex];

  if (current) {
    const currentStatus = statuses[currentIndex];

    // Değişiklik yapılmaması gereken durumlar
    if (currentStatus === 'success' || currentStatus === 'fail') return;
    if (currentStatus !== 'none' && status === 'none') return;

    current.classList.remove('success', 'fail', 'pass', 'timeout');
    current.classList.add(status);
    statuses[currentIndex] = status;
  }

  currentIndex++;
  updateStats();

  if (currentIndex < letters.length) {
    startTimer();
  }
}

function startTimer() {
  timeoutId = setTimeout(() => {
    markLetter('timeout');
  }, 5000);
}

function startMainTimer() {
  let totalSeconds = 240;
  const timerDisplay = document.getElementById('main-timer');

  const interval = setInterval(() => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;

    totalSeconds--;
    if (totalSeconds < 0) {
      clearInterval(interval);
      timerDisplay.textContent = "Süre Bitti!";
    }
  }, 1000);
}

function updateStats() {
  const stats = {
    success: 0,
    fail: 0,
    pass: 0,
    timeout: 0
  };

  statuses.forEach(status => {
    if (stats[status] !== undefined) {
      stats[status]++;
    }
  });

  document.getElementById('stat-success').textContent = stats.success;
  document.getElementById('stat-fail').textContent = stats.fail;
  document.getElementById('stat-pass').textContent = stats.pass;
  document.getElementById('stat-timeout').textContent = stats.timeout;
}

window.onload = createLetters;
