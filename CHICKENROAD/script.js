const chicken = document.getElementById('chicken');
const multipliers = document.querySelectorAll('.multiplier-circle');
const winPopup = document.getElementById('winPopup');
const multiplierValue = document.getElementById('multiplierValue');
const playButton = document.querySelector('.play-btn');
const jumpSound = document.getElementById('jumpSound');
const timerDisplay = document.getElementById('timerDisplay');
const loader = document.getElementById('loader');
const backButtonMain = document.querySelector('.back-btn-main');
const scrollContainer = document.querySelector('.scroll-container');

const platformMultipliers = [
  1.03, 1.07, 1.12, 1.17, 1.23, 1.29, 1.36, 1.44, 1.53, 1.63,
  1.75, 1.88, 2.04, 2.22, 2.45, 2.72, 3.06, 3.50, 4.08, 4.90,
  6.13, 9.81, 19.44
];

let gameInProgress = false;
let canPlay = true;
let loaderTimeoutId = null;
let cooldownIntervalId = null;
let initialChickenResetDone = false;

function resetChickenToStartPosition(animate = false) {
    if (multipliers.length > 0) {
        const firstMultiplier = multipliers[0];
        const targetLeft = firstMultiplier.offsetLeft;

        chicken.style.transform = 'translateY(0) translateX(+5%)';

        if (animate) {
            chicken.style.left = targetLeft + "px";
        } else {
            const originalTransition = chicken.style.transition;
            chicken.style.transition = 'none';
            chicken.style.left = targetLeft + "px";
            chicken.offsetHeight;
            chicken.style.transition = originalTransition;
        }

        scrollContainer.scrollTo({
            left: 0,
            behavior: animate ? 'smooth' : 'auto'
        });
    }
}

function initialChickenSetup() {
    if (!initialChickenResetDone && multipliers.length > 0 && multipliers[0].offsetLeft > 0) {
        resetChickenToStartPosition(false);
        initialChickenResetDone = true;
    } else if (!initialChickenResetDone) {
        setTimeout(initialChickenSetup, 150);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initialChickenSetup, 100);
});


function startGame() {
  if (gameInProgress || !canPlay) {
    console.log("Подожди 10 секунд перед следующим запуском или завершения текущей игры.");
    return;
  }

  canPlay = false;

  playButton.style.display = 'none';
  backButtonMain.style.display = 'none';
  loader.style.display = 'flex';
  timerDisplay.textContent = "Загрузка...";

  if (loaderTimeoutId) {
    clearTimeout(loaderTimeoutId);
  }

  loaderTimeoutId = setTimeout(() => {
    loaderTimeoutId = null;
    loader.style.display = 'none';
    timerDisplay.textContent = "";

    gameInProgress = true;

    playButton.disabled = true;
    playButton.style.opacity = "0.6";
    playButton.style.display = 'block';
    backButtonMain.style.display = 'block';

    if (cooldownIntervalId) {
        clearInterval(cooldownIntervalId);
    }

    let countdown = 10;
    timerDisplay.textContent = `Подожди: ${countdown} сек`;
    cooldownIntervalId = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        timerDisplay.textContent = `Подожди: ${countdown} сек`;
      } else {
        clearInterval(cooldownIntervalId);
        cooldownIntervalId = null;
        timerDisplay.textContent = "";
        canPlay = true;
        if (!gameInProgress) {
            playButton.disabled = false;
            playButton.style.opacity = "1";
            resetChickenToStartPosition(true);
        }
      }
    }, 1000);

    let randomMultiplierIndex = Math.floor(Math.random() * multipliers.length);
    let multiplierCircle = multipliers[randomMultiplierIndex];
    let multiplier = platformMultipliers[randomMultiplierIndex];

    multipliers.forEach(m => {
        if (m.style.backgroundColor !== 'rgba(255, 255, 255, 0.5)') {
             m.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }
    });
    multiplierCircle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';

    chicken.style.left = multiplierCircle.offsetLeft + "px";
    chicken.style.transform = `translateY(-100px) translateX(+5%)`;
    jumpSound.play();

    setTimeout(() => {
      chicken.style.transform = `translateY(0) translateX(+5%)`;
      showWinPopup(multiplier);
    }, 500);

    scrollContainer.scrollTo({
      left: multiplierCircle.offsetLeft - (scrollContainer.offsetWidth / 2) + (multiplierCircle.offsetWidth / 2),
      behavior: 'smooth'
    });

  }, 2000);
}

function showWinPopup(multiplier) {
  const popup = document.querySelector('.win-popup');
  const winSound = document.getElementById('winSound');

  if (multiplierValue) {
    multiplierValue.textContent = multiplier;
  } else {
    popup.querySelector('p').textContent = `x${multiplier}`;
  }

  popup.classList.add('shake');
  popup.style.display = 'block';

  winSound.currentTime = 0;
  winSound.play();

  setTimeout(() => {
    popup.style.display = 'none';
    popup.classList.remove('shake');
    gameInProgress = false;

    if (canPlay && !cooldownIntervalId) {
        playButton.disabled = false;
        playButton.style.opacity = "1";
        resetChickenToStartPosition(true);
    }
  }, 3000);
}

function handleNavigationCleanup() {
    if (loaderTimeoutId) {
        clearTimeout(loaderTimeoutId);
        loaderTimeoutId = null;
        loader.style.display = 'none';
        playButton.style.display = 'block';
        backButtonMain.style.display = 'block';
        canPlay = true;
        timerDisplay.textContent = "";
        playButton.disabled = false;
        playButton.style.opacity = "1";
    }
    if (cooldownIntervalId) {
        clearInterval(cooldownIntervalId);
        cooldownIntervalId = null;
    }
    if (winPopup.style.display === 'block') {
        winPopup.style.display = 'none';
        winPopup.classList.remove('shake');
    }
    gameInProgress = false;
}

function goBack() {
  handleNavigationCleanup();
  window.location.href = 'https://google.com';
}

function goBackFromTab() {
    handleNavigationCleanup();
    window.location.href = 'https://google.com';
}

function closePopup() {
  winPopup.style.display = 'none';
  winPopup.classList.remove('shake');
  gameInProgress = false;
   if (canPlay && !cooldownIntervalId) {
        playButton.disabled = false;
        playButton.style.opacity = "1";
        resetChickenToStartPosition(true);
    }
}