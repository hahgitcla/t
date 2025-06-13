document.addEventListener('DOMContentLoaded', function () {
  const cellsBoard = document.querySelector('.cells-board');
  if (!cellsBoard) {
    console.error('Element .cells-board not found.');
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const botName = urlParams.get('botName') || 'Unknown';
  const language = urlParams.get('language') || 'en';
  const trapPresets = [1, 3, 5, 7];
  const trapCounts = {
    '1': 7,
    '3': 5,
    '5': 4,
    '7': 3,
  };
  let currentPresetIndex = 0;
  const trapsAmountElement = document.getElementById('trapsAmount');
  const prevPresetButton = document.getElementById('prev_preset_btn');
  const nextPresetButton = document.getElementById('next_preset_btn');
  const modeButton = document.getElementById('modeButton');
  let currentMode = 'nesk';

  function updateTrapsAmount() {
    trapsAmountElement && (trapsAmountElement.textContent = trapPresets[currentPresetIndex]);
  }

  if (prevPresetButton) {
    prevPresetButton.addEventListener('click', function () {
      if (currentPresetIndex > 0) {
        currentPresetIndex--;
        updateTrapsAmount();
      }
    });
  }

  if (nextPresetButton) {
    nextPresetButton.addEventListener('click', function () {
      if (currentPresetIndex < trapPresets.length - 1) {
        currentPresetIndex++;
        updateTrapsAmount();
      }
    });
  }

  modeButton &&
    modeButton.addEventListener('click', function () {
      currentMode = currentMode === 'nesk' ? 'all' : 'nesk';
      modeButton.textContent =
        currentMode === 'nesk' ? 'Switch to All' : 'Switch to multiple';
    });

  updateTrapsAmount();

  function addClickListenersToCells() {
    const cells = document.querySelectorAll('.cells-board .cell');
    cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        cell.style.transform = 'scale(0.7)';
        setTimeout(() => {
          cell.style.transform = 'scale(1)';
        }, 200);
      });
    });
  }

  let isFirstPlay = true;
  const playButton = document.getElementById('playButton');
  playButton &&
    playButton.addEventListener('click', function () {
      playButton.disabled = true;
      let cells = document.querySelectorAll('.cells-board .cell');
      if (!isFirstPlay) {
        cellsBoard.innerHTML = '';
        generateBoard();
        cells = document.querySelectorAll('.cells-board .cell');
      }
      const trapCount = parseInt(trapsAmountElement.textContent);
      const totalCells = cells.length;
      const trapIndices = new Set();
      while (trapIndices.size < trapCount) {
        const randomIndex = Math.floor(Math.random() * totalCells);
        trapIndices.add(randomIndex);
      }
      if (currentMode === 'nesk') {
        const additionalTraps = trapCounts[trapCount] || 0;
        const additionalTrapIndices = [];
        while (additionalTrapIndices.length < additionalTraps) {
          const randomIndex = Math.floor(Math.random() * cells.length);
          if (!additionalTrapIndices.includes(randomIndex)) {
            additionalTrapIndices.push(randomIndex);
          }
        }
        let currentTrapIndex = 0;
        function animateTraps() {
          if (currentTrapIndex < additionalTrapIndices.length) {
            const trapIndex = additionalTrapIndices[currentTrapIndex];
            const cell = cells[trapIndex];
            cell.classList.add('cell-fade-out');
            setTimeout(async () => {
              cell.innerHTML = '';
              try {
                const response = await fetch('img/stars.svg');
                const svgContent = await response.text();
                const container = document.createElement('div');
                container.style.cssText = `
                  width: 56px;
                  height: 56px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                `;
                container.innerHTML = svgContent;
                cell.appendChild(container);
                const svgElement = container.querySelector('svg');
                if (svgElement) {
                  svgElement.style.cssText = `
                    width: 56px;
                    height: 56px;
                    max-width: 100%;
                    max-height: 100%;
                    display: block;
                    opacity: 0;
                    transform: scale(0);
                    transition: opacity 0.3s, transform 0.3s;
                  `;
                  const viewBox = svgElement.getAttribute('viewBox');
                  if (!viewBox) {
                    const width = svgElement.getAttribute('width') || '100';
                    const height = svgElement.getAttribute('height') || '100';
                    svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
                  }
                  svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                  svgElement.classList.add('star-animation');
                  requestAnimationFrame(() => {
                    svgElement.style.opacity = '1';
                    svgElement.style.transform = 'scale(1)';
                  });
                }
              } catch (error) {
                const imgElement = document.createElement('img');
                imgElement.style.cssText = `
                  width: 56px;
                  height: 56px;
                  display: block;
                  will-change: transform, opacity;
                  opacity: 0;
                  transform: scale(0);
                  transition: opacity 0.3s, transform 0.3s;
                `;
                imgElement.src = 'img/stars.svg';
                cell.appendChild(imgElement);
                requestAnimationFrame(() => {
                  imgElement.style.opacity = '1';
                  imgElement.style.transform = 'scale(1)';
                });
              }
              cell.classList.remove('cell-fade-out');
              currentTrapIndex++;
              setTimeout(animateTraps, 700);
            }, 400);
          } else {
            playButton.disabled = false;
            isFirstPlay && (isFirstPlay = false);
          }
        }
        animateTraps();
      } else {
        Promise.all(
          [...cells].map((cell, index) => {
            return new Promise(async (resolve) => {
              cell.classList.add('cell-fade-out');
              cell.innerHTML = '';
              try {
                const response = await fetch(
                  trapIndices.has(index) ? 'img/krest.svg' : 'img/stars.svg'
                );
                const svgContent = await response.text();
                const container = document.createElement('div');
                container.style.cssText = `
                  width: 56px;
                  height: 56px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                `;
                container.innerHTML = svgContent;
                cell.appendChild(container);
                const svgElement = container.querySelector('svg');
                if (svgElement) {
                  svgElement.style.cssText = `
                    width: 56px;
                    height: 56px;
                    max-width: 100%;
                    max-height: 100%;
                    display: block;
                    opacity: 0;
                    transform: scale(0);
                    transition: opacity 0.3s, transform 0.3s;
                  `;
                  const viewBox = svgElement.getAttribute('viewBox');
                  if (!viewBox) {
                    const width = svgElement.getAttribute('width') || '100';
                    const height = svgElement.getAttribute('height') || '100';
                    svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
                  }
                  svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                  svgElement.classList.add('star-animation');
                  svgElement.style.opacity = '0';
                  svgElement.style.transform = 'scale(0)';
                  requestAnimationFrame(() => {
                    svgElement.style.opacity = '1';
                    svgElement.style.transform = 'scale(1)';
                  });
                }
              } catch (error) {
                const imgElement = document.createElement('img');
                imgElement.style.cssText = `
                  width: 56px;
                  height: 56px;
                  display: block;
                  will-change: transform, opacity;
                  opacity: 0;
                  transform: scale(0);
                  transition: opacity 0.3s, transform 0.3s;
                `;
                imgElement.src = trapIndices.has(index)
                  ? 'img/krest.svg'
                  : 'img/stars.svg';
                cell.appendChild(imgElement);
                requestAnimationFrame(() => {
                  imgElement.style.opacity = '1';
                  imgElement.style.transform = 'scale(1)';
                });
              }
              cell.classList.remove('cell-fade-out');
              resolve();
            });
          })
        ).then(() => {
          playButton.disabled = false;
          if (isFirstPlay) {
            isFirstPlay = false;
          }
        });
      }
    });

  function generateBoard() {
    const svgFiles = [
      'output_svgs/image_5450.svg',
      'output_svgs/image_11641.svg',
      'output_svgs/image_18337.svg',
      'output_svgs/image_24493.svg',
      'output_svgs/image_31201.svg',
      'output_svgs/image_37357.svg',
      'output_svgs/image_44065.svg',
      'output_svgs/image_50221.svg',
      'output_svgs/image_56929.svg',
      'output_svgs/image_63085.svg',
      'output_svgs/image_69793.svg',
      'output_svgs/image_75949.svg',
      'output_svgs/image_82645.svg',
      'output_svgs/image_89353.svg',
      'output_svgs/image_95509.svg',
      'output_svgs/image_102217.svg',
      'output_svgs/image_108373.svg',
      'output_svgs/image_115081.svg',
      'output_svgs/image_121237.svg',
      'output_svgs/image_127381.svg',
      'output_svgs/image_134077.svg',
      'output_svgs/image_140221.svg',
      'output_svgs/image_146917.svg',
      'output_svgs/image_153061.svg',
      'output_svgs/image_159757.svg',
    ];
    svgFiles.forEach((file) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cell';
      button.innerHTML = `<img width="56" height="56" src="${file}">`;
      cellsBoard.appendChild(button);
    });
    addClickListenersToCells();
  }

  generateBoard();
});