import { getHash, getFlightResult } from './local-api.js';

document.addEventListener('DOMContentLoaded', () => {
  const isConsideredMobile = () => {
    let check = false;
    (function(a){
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|rim)|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n203|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|71|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
        check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);

    if (!check && /ipad/i.test(navigator.userAgent)) {
        check = true;
    }
    return check;
  };

  const preloader = document.getElementById('preloader');
  const preloaderImage = preloader ? preloader.querySelector('.preloader-image') : null;
  const mainGameContent = document.getElementById('mainGameContent');
  
  const ballContainerElement = document.getElementById("ballContainer");
  const startButtonElement = document.getElementById("startButton"); 

  const preloaderHashDisplayElement = document.getElementById('preloaderHashDisplay');
  const siteHashDisplayElement = document.getElementById('siteSessionHashDisplay'); 

  const statusLoaderOverlay = document.getElementById('statusLoaderOverlay');
  const statusLoaderTitle = document.getElementById('statusLoaderTitle');
  const statusLoaderLogs = document.getElementById('statusLoaderLogs');
  const analysisDisplay = document.getElementById('analysisDisplay'); 
  const statusLoaderMessage = document.getElementById('statusLoaderMessage');
  const statusLoaderCloseButton = document.getElementById('statusLoaderCloseButton');

  const aviaDecorativeImage = document.getElementById('aviaDecorativeImage');
  let aviaInitialLeft = '10px'; 
  let aviaInitialOpacity = '0.8'; 

  if (aviaDecorativeImage) {
      const styles = window.getComputedStyle(aviaDecorativeImage);
      aviaInitialLeft = styles.left;
      aviaInitialOpacity = styles.opacity;
      
      aviaDecorativeImage.style.setProperty('--avia-initial-left', aviaInitialLeft);
      aviaDecorativeImage.style.setProperty('--avia-initial-opacity', aviaInitialOpacity);
  }

  const flightAnalysisSection = document.getElementById('flightAnalysisSection');
  const flightAnalysisTextElement = document.getElementById('flightAnalysisText');
  const flightProgressBarFillElement = document.getElementById('flightProgressBarFill');
  let analysisDotsIntervalId = null;
  let analysisDotCount = 0;

  async function fetchHashFromServer() {
    return getHash();
  }

  function easeInOutQuad(t) { 
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  let generatedHash = "";

  (async () => {
  generatedHash = await fetchHashFromServer();

  if (preloaderHashDisplayElement) {
    preloaderHashDisplayElement.textContent = generatedHash;
  }
  if (siteHashDisplayElement) {
    siteHashDisplayElement.textContent = generatedHash;
  }

  setTimeout(() => {
    if (preloader) {
      if (mainGameContent) mainGameContent.style.display = 'flex';
      if (preloaderImage) { 
        const clonedLogo = preloaderImage.cloneNode(true);
        clonedLogo.id = 'gameLogo';
        clonedLogo.classList.remove('preloader-image');
        const preloaderImgStyles = window.getComputedStyle(preloaderImage);
        clonedLogo.style.width = preloaderImgStyles.width;
        clonedLogo.style.height = preloaderImgStyles.height;
        document.body.appendChild(clonedLogo); 
        clonedLogo.addEventListener('animationend', () => {
          if (ballContainerElement) { 
            ballContainerElement.style.opacity = '1'; 
            ballContainerElement.classList.add('visible'); 
          }
          if (startButtonElement) { 
            startButtonElement.style.display = 'block'; 
            requestAnimationFrame(() => startButtonElement.classList.add('visible'));
          }
          if (siteHashDisplayElement) siteHashDisplayElement.classList.add('visible');
        }, { once: true });
        requestAnimationFrame(() => requestAnimationFrame(() => clonedLogo.classList.add('flying')));
      } else { 
        if (siteHashDisplayElement) siteHashDisplayElement.classList.add('visible');
      }
      preloader.style.opacity = '0';
      setTimeout(() => { 
          preloader.classList.add('hidden'); 
          if (!preloaderImage && siteHashDisplayElement && !siteHashDisplayElement.classList.contains('visible')) {
            siteHashDisplayElement.classList.add('visible');
          }
      }, preloaderFadeOutTime);
    } else { 
      if (mainGameContent) mainGameContent.style.display = 'flex';
      if (ballContainerElement) { 
         ballContainerElement.style.opacity = '1';
         ballContainerElement.classList.add('visible');
      }
      if (startButtonElement) {
          startButtonElement.style.display = 'block';
          startButtonElement.classList.add('visible');
      }
      if (siteHashDisplayElement) siteHashDisplayElement.classList.add('visible');
    }
  }, preloaderDuration);

  })();

  if (preloaderHashDisplayElement) {
    preloaderHashDisplayElement.textContent = generatedHash;
  }
  if (siteHashDisplayElement) {
    siteHashDisplayElement.textContent = generatedHash;
  }
  
  const preloaderDuration = 2500; 
  const preloaderFadeOutTime = 500; 


  const bettingPanel = document.getElementById("bettingPanel");
  const confirmButton = document.getElementById("confirmButton");
  const betDisplay = document.getElementById("betDisplay"); 
  const ballImage = document.getElementById("ball"); 
  const accountIdInput = document.getElementById("accountIdInput"); 
  const idErrorMessage = document.getElementById("idErrorMessage"); 
  
  let accountId = ""; 
  let gameAnimationId = null; 

  function hideFlightAnalysis() {
    if (analysisDotsIntervalId) {
      clearInterval(analysisDotsIntervalId);
      analysisDotsIntervalId = null;
    }
    if (flightAnalysisSection) {
      flightAnalysisSection.classList.remove('visible');
      setTimeout(() => {
        if (flightAnalysisSection && !flightAnalysisSection.classList.contains('visible')) {
          flightAnalysisSection.style.display = 'none';
        }
      }, 400);
    }
    if (flightProgressBarFillElement) flightProgressBarFillElement.style.width = '0%';
    if (flightAnalysisTextElement) flightAnalysisTextElement.textContent = 'Анализ';
  }


  if (startButtonElement) { 
    startButtonElement.addEventListener("click", () => {
      if (bettingPanel) {
        bettingPanel.style.display = "flex";
        setTimeout(() => bettingPanel.classList.add("visible"), 10); 
      }
      startButtonElement.classList.remove('visible'); 
      setTimeout(() => { if (startButtonElement && !startButtonElement.classList.contains('visible')) startButtonElement.style.display = "none"; }, 500); 
      if (accountIdInput) accountIdInput.value = ""; 
      if (idErrorMessage) { idErrorMessage.style.display = "none"; idErrorMessage.textContent = ""; }
      if (ballContainerElement) ballContainerElement.classList.remove('visible'); 
      if (statusLoaderOverlay) { 
        statusLoaderOverlay.classList.remove('visible');
        setTimeout(() => { if(statusLoaderOverlay && !statusLoaderOverlay.classList.contains('visible')) statusLoaderOverlay.style.display = "none"; }, 300);
      }
      if (aviaDecorativeImage) {
          aviaDecorativeImage.classList.remove('is-flying-away');
          aviaDecorativeImage.style.left = aviaInitialLeft;
          aviaDecorativeImage.style.opacity = aviaInitialOpacity;
      }
      hideFlightAnalysis();
      updateConfirmButtonState();
    });
  }

  function updateConfirmButtonState() {
    if (!accountIdInput || !confirmButton || !idErrorMessage) return; 
    const idValue = accountIdInput.value.trim();
    const onlyFigures = /^\d+$/;
    let isValid = true;
    const genericErrorMessage = "Введите корректную сумму"; 
    if (idValue === "") { confirmButton.disabled = true; idErrorMessage.style.display = "none"; idErrorMessage.textContent = ""; return; }
    if (!onlyFigures.test(idValue) || idValue.length < 1 || idValue.length > 9) isValid = false;
    if (isValid) { confirmButton.disabled = false; idErrorMessage.style.display = "none"; idErrorMessage.textContent = ""; }
    else { confirmButton.disabled = true; idErrorMessage.textContent = genericErrorMessage; idErrorMessage.style.display = "block"; }
  }
  
  if (accountIdInput) accountIdInput.addEventListener("input", updateConfirmButtonState); 

  if (confirmButton) { 
    confirmButton.addEventListener("click", async () => { 
      if (confirmButton.disabled) return; 
      if (accountIdInput) accountId = accountIdInput.value.trim(); 
      if (betDisplay) betDisplay.style.opacity = 0; 
      if (bettingPanel) {
        bettingPanel.classList.remove("visible");
        bettingPanel.classList.add("hiding");
        setTimeout(() => { if (bettingPanel) { bettingPanel.style.display = "none"; bettingPanel.classList.remove("hiding");} }, 400); 
      }
      if (startButtonElement) { startButtonElement.classList.remove('visible'); startButtonElement.style.display = 'none'; }
      window.scrollTo(0, 0); 
      
      hideFlightAnalysis();
      await runPreFlightSync(); 
      startGameAnimation(); 
    });
  }

  const MAX_RETRIES = 2; 
  const SUCCESS_CHANCE = 0.75; 

  function quickLog(message, type = "info") {
    if (!statusLoaderLogs) return;
    const p = document.createElement('p');
    p.textContent = message;
    p.className = `log-${type}`;
    statusLoaderLogs.appendChild(p);
    statusLoaderLogs.scrollTop = statusLoaderLogs.scrollHeight;
  }
  
  async function attemptConnection(serviceName) {
    quickLog(`Попытка подключения к ${serviceName}...`, "process");
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300)); 

    for (let i = 0; i <= MAX_RETRIES; i++) {
      if (Math.random() < SUCCESS_CHANCE || i === MAX_RETRIES) { 
        quickLog(`${serviceName}: Подключение установлено.`, "success");
        return true;
      } else {
        quickLog(`${serviceName}: Ошибка подключения (попытка ${i + 1})...`, "error");
        if (i < MAX_RETRIES) {
          quickLog(`Переподключение к ${serviceName}...`, "warning");
          await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
        }
      }
    }
    return false; 
  }

  async function runPreFlightSync() {
    if (statusLoaderOverlay) {
      statusLoaderOverlay.style.display = "flex";
      requestAnimationFrame(() => statusLoaderOverlay.classList.add("visible"));
    }
    if (statusLoaderTitle) statusLoaderTitle.textContent = "Подготовка к полету";
    if (statusLoaderLogs) statusLoaderLogs.innerHTML = "";
    if (statusLoaderMessage) statusLoaderMessage.textContent = "Инициализация систем...";
    if (statusLoaderCloseButton) statusLoaderCloseButton.style.display = "none";

    const services = [
      "Система навигации",
      "Датчики погоды",
      "Система связи",
      "Контроль двигателей"
    ];

    for (const service of services) {
      const success = await attemptConnection(service);
      if (!success) {
        quickLog(`Критическая ошибка: не удалось подключиться к ${service}`, "error");
        if (statusLoaderMessage) statusLoaderMessage.textContent = "Ошибка инициализации";
        if (statusLoaderCloseButton) {
          statusLoaderCloseButton.style.display = "block";
          statusLoaderCloseButton.onclick = () => {
            if (statusLoaderOverlay) {
              statusLoaderOverlay.classList.remove("visible");
              setTimeout(() => { if(statusLoaderOverlay && !statusLoaderOverlay.classList.contains('visible')) statusLoaderOverlay.style.display = "none"; }, 300);
            }
          };
        }
        return false;
      }
    }

    quickLog("Все системы готовы к полету", "success");
    if (statusLoaderMessage) statusLoaderMessage.textContent = "Системы готовы";
    if (statusLoaderCloseButton) {
      statusLoaderCloseButton.style.display = "block";
      statusLoaderCloseButton.onclick = () => {
        if (statusLoaderOverlay) {
          statusLoaderOverlay.classList.remove("visible");
          setTimeout(() => { if(statusLoaderOverlay && !statusLoaderOverlay.classList.contains('visible')) statusLoaderOverlay.style.display = "none"; }, 300);
        }
      };
    }
    return true;
  }

  async function runPostFlightStatus() {
    if (statusLoaderOverlay) {
      statusLoaderOverlay.style.display = "flex";
      requestAnimationFrame(() => statusLoaderOverlay.classList.add("visible"));
    }
    if (statusLoaderTitle) statusLoaderTitle.textContent = "Анализ полета";
    if (statusLoaderLogs) statusLoaderLogs.innerHTML = "";
    if (statusLoaderMessage) statusLoaderMessage.textContent = "Обработка данных...";
    if (statusLoaderCloseButton) statusLoaderCloseButton.style.display = "none";

    const result = await fetchFlightResult(accountId);
    if (result) {
      quickLog("Получены данные о полете", "success");
      quickLog(result, "info");
    } else {
      quickLog("Ошибка при получении данных о полете", "error");
    }

    if (statusLoaderMessage) statusLoaderMessage.textContent = "Анализ завершен";
    if (statusLoaderCloseButton) {
      statusLoaderCloseButton.style.display = "block";
      statusLoaderCloseButton.onclick = () => {
        if (statusLoaderOverlay) {
          statusLoaderOverlay.classList.remove("visible");
          setTimeout(() => { if(statusLoaderOverlay && !statusLoaderOverlay.classList.contains('visible')) statusLoaderOverlay.style.display = "none"; }, 300);
        }
      };
    }
  }

  async function fetchFlightResult(bet) {
    try {
      return await getFlightResult(bet);
    } catch (error) {
      console.error("Error fetching flight result:", error);
      return null;
    }
  }

  function animateAnalysisTextDots() {
    if (analysisDotsIntervalId) {
      clearInterval(analysisDotsIntervalId);
    }
    analysisDotCount = 0;
    if (flightAnalysisTextElement) flightAnalysisTextElement.textContent = "Анализ";
    analysisDotsIntervalId = setInterval(() => {
      analysisDotCount = (analysisDotCount + 1) % 4;
      if (flightAnalysisTextElement) {
        flightAnalysisTextElement.textContent = "Анализ" + ".".repeat(analysisDotCount);
      }
    }, 500);
  }

  function startGameAnimation() {
    if (gameAnimationId) {
      cancelAnimationFrame(gameAnimationId);
    }

    const startTime = performance.now();
    const duration = 5000;
    const distance = 100;
    const startX = 0;
    const startY = 0;

    if (flightAnalysisSection) {
      flightAnalysisSection.style.display = "flex";
      requestAnimationFrame(() => flightAnalysisSection.classList.add("visible"));
    }
    animateAnalysisTextDots();

    function animateFrame(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutQuad(progress);

      const currentX = startX + (distance * easedProgress);
      const currentY = startY + (Math.sin(progress * Math.PI * 2) * 20);

      if (ballImage) {
        ballImage.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      if (flightProgressBarFillElement) {
        flightProgressBarFillElement.style.width = `${progress * 100}%`;
      }

      if (progress < 1) {
        gameAnimationId = requestAnimationFrame(animateFrame);
      } else {
        if (ballImage) ballImage.style.transform = `translate(${distance}px, 0)`;
        if (flightProgressBarFillElement) flightProgressBarFillElement.style.width = "100%";
        if (analysisDotsIntervalId) {
          clearInterval(analysisDotsIntervalId);
          analysisDotsIntervalId = null;
        }
        if (flightAnalysisTextElement) flightAnalysisTextElement.textContent = "Анализ завершен";
        if (aviaDecorativeImage) {
          aviaDecorativeImage.classList.add('is-flying-away');
        }
        setTimeout(() => {
          runPostFlightStatus();
        }, 1000);
      }
    }

    gameAnimationId = requestAnimationFrame(animateFrame);
  }
});
