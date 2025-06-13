const startButton = document.getElementById('startButton'),
  bettingPanel = document.getElementById('bettingPanel'),
  confirmButton = document.getElementById('confirmButton'),
  betDisplay = document.getElementById('betDisplay'),
  ball = document.getElementById('ball'),
  betInput = document.getElementById('betAmount'),
  currencyInputs = document.querySelectorAll('input[name=\'currency\']'),
  ballContainer = document.querySelector('.ball-container');
let betAmount = 0,
  selectedCurrency = '';
startButton.addEventListener('click', () => {
  bettingPanel.style.display = 'flex', setTimeout(() => {
    bettingPanel.classList.add('visible');
  }, 10), startButton.style.display = 'none';
});
function updateConfirmButtonState() {
  const _0x41b921 = Array.from(currencyInputs).some(_0x515b0c => _0x515b0c.checked);
  const _0x2804e3 = parseFloat(betInput.value) > 0;
  confirmButton.disabled = !(_0x41b921 && _0x2804e3);
}
betInput.addEventListener('input', updateConfirmButtonState), currencyInputs.forEach(_0x45d6e7 => {
  _0x45d6e7.addEventListener('change', updateConfirmButtonState);
}), confirmButton.addEventListener('click', () => {
  betAmount = parseFloat(betInput.value) || 0;
  selectedCurrency = document.querySelector('input[name=\'currency\']:checked').value, betDisplay.innerHTML = '' + selectedCurrency + betAmount.toFixed(2), betDisplay.style.opacity = 1, bettingPanel.classList.remove('visible');
  bettingPanel.classList.add('hiding'), restartButton.style.display = 'block';
  setTimeout(() => {
    bettingPanel.style.display = 'none', bettingPanel.classList.remove('hiding');
  }, 400), window.scrollTo(0, 0);
  ball.classList.add('inflating'), animateBallAndBet();
});
function getRandomMultiplier() {
  const _0x557373 = {};
  _0x557373.min = 0x2, _0x557373.max = 0x3;
  _0x557373.weight = 0.4;
  const _0x21fe9c = {};
  _0x21fe9c.min = 0x3;
  _0x21fe9c.max = 3.5, _0x21fe9c.weight = 0.3;
  const _0x57ce5e = {};
  _0x57ce5e.min = 3.5, _0x57ce5e.max = 0x4, _0x57ce5e.weight = 0.2;
  const _0x134915 = {};
  _0x134915.min = 0x4, _0x134915.max = 0x5, _0x134915.weight = 0.1;
  const _0x18d1d6 = [_0x557373, _0x21fe9c, _0x57ce5e, _0x134915],
    _0x52b635 = _0x18d1d6.reduce((_0xd1564, _0x1f8580) => _0xd1564 + _0x1f8580.weight, 0);
  let _0x2d6e57 = Math.random() * _0x52b635;
  for (const {
    min: _0x478979,
    max: _0x48424e,
    weight: _0x521940
  } of _0x18d1d6) {
    if (_0x2d6e57 < _0x521940) {
      return Math.random() * (_0x48424e - _0x478979) + _0x478979;
    }
    _0x2d6e57 -= _0x521940;
  }
}
function animateBallAndBet() {
  let _0x3777dd = 1,
    _0x1f60e9 = betAmount;
  const _0x116786 = getRandomMultiplier(),
    _0x22bcab = 1.8,
    _0x76ca20 = 1.6,
    _0x47fea6 = 100 / _0x116786;
  let _0x5e1d47 = false;
  let _0x39aec3 = 0.01;
  const _0x3da4db = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-balloon-foil-squeak-2811.mp3');
  _0x3da4db.volume = 0.3, _0x3da4db.loop = true, _0x3da4db.play().catch(_0x1efba4 => {
    console.log('Автовоспроизведение звука заблокировано браузером:', _0x1efba4);
  });
  const _0x2e42f2 = setInterval(() => {
    if (_0x3777dd >= _0x22bcab && !_0x5e1d47) {
      _0x5e1d47 = true;
      _0x3da4db.pause();
      ball.classList.remove('inflating');
      explodeBalloon(_0x116786);
      clearInterval(_0x2e42f2);
    } else {
      if (!_0x5e1d47) {
        _0x39aec3 = _0x39aec3 * 1.03, _0x3777dd += 0.02 + _0x39aec3, _0x1f60e9 = betAmount * (_0x3777dd / _0x22bcab) * _0x116786;
        const _0x5c2b69 = 200 * _0x3777dd;
        ballContainer.style.width = _0x5c2b69 + 'px', ballContainer.style.height = _0x5c2b69 + 'px', ball.style.transform = 'scale(' + _0x3777dd + ')', ball.style.transition = 'transform 0.1s ease-in-out';
        if (_0x3777dd > _0x22bcab * 0.8) {
          const _0x281367 = _0x3777dd / _0x22bcab * 2 - 1.6;
          if (_0x281367 > 0) {
            const _0x549c3a = (Math.random() - 0.5) * _0x281367,
              _0x445b8d = (Math.random() - 0.5) * _0x281367;
            ball.style.transform = 'scale(' + _0x3777dd + ') translate(' + _0x549c3a + 'px, ' + _0x445b8d + 'px)';
          }
        }
        betDisplay.style.transform = 'translate(-50%, -50%) scale(' + Math.min(_0x3777dd, _0x76ca20) + ')', betDisplay.style.fontSize = 13 + 5 * Math.min(_0x3777dd, _0x76ca20) + 'px', betDisplay.innerHTML = '' + selectedCurrency + _0x1f60e9.toFixed(2);
      }
    }
  }, _0x47fea6);
}
function explodeBalloon(_0x18ab4a) {
  const _0x46e734 = document.createElement('div');
  _0x46e734.className = 'explosion-container', ballContainer.appendChild(_0x46e734);
  playExplosionSound();
  for (let _0x22a0be = 0; _0x22a0be < 40; _0x22a0be++) {
    const _0x58b84d = document.createElement('div');
    _0x58b84d.className = 'explosion-particle';
    const _0x5544b9 = Math.random() * Math.PI * 2,
      _0x1577bd = 50 + Math.random() * 150,
      _0x19f47f = 0.5 + Math.random() * 1,
      _0x5baa64 = 5 + Math.random() * 20;
    _0x58b84d.style.backgroundColor = getRandomColor(), _0x58b84d.style.left = '50%', _0x58b84d.style.top = '50%', _0x58b84d.style.width = _0x5baa64 + 'px', _0x58b84d.style.height = _0x5baa64 + 'px', _0x58b84d.style.animation = 'explode ' + _0x19f47f + 's ease-out forwards', _0x58b84d.style.transform = 'translate(-50%, -50%) rotate(' + Math.random() * 360 + 'deg)', _0x58b84d.style.setProperty('--end-x', Math.cos(_0x5544b9) * _0x1577bd + 'px'), _0x58b84d.style.setProperty('--end-y', Math.sin(_0x5544b9) * _0x1577bd + 'px'), _0x46e734.appendChild(_0x58b84d);
  }
  const _0x1a500a = document.createElement('div');
  _0x1a500a.className = 'shockwave', _0x46e734.appendChild(_0x1a500a), ball.style.opacity = '0', ball.style.transition = 'opacity 0.2s ease-out';
  const _0xbf2ffb = betAmount * _0x18ab4a;
  setTimeout(() => {
    betDisplay.innerHTML = '' + selectedCurrency + _0xbf2ffb.toFixed(2);
    betDisplay.style.fontSize = '36px';
    betDisplay.style.color = '#FFD700';
    betDisplay.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.7)';
    betDisplay.classList.add('win-amount');
  }, 200);
}
function playExplosionSound() {
  const _0x300c90 = new Audio();
  _0x300c90.src = 'https://assets.mixkit.co/sfx/preview/mixkit-explosion-impact-1682.mp3';
  _0x300c90.volume = 0.5, _0x300c90.play().catch(_0x1be018 => {
    console.log('Автовоспроизведение звука заблокировано браузером:', _0x1be018);
  });
}
function getRandomColor() {
  const _0x3dfed1 = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];
  return _0x3dfed1[Math.floor(Math.random() * _0x3dfed1.length)];
}
restartButton.addEventListener('click', () => {
  bettingPanel.style.display = 'none', startButton.style.display = 'block', restartButton.style.display = 'none';
  betDisplay.style.opacity = 0;
  betDisplay.style.color = '#fff', betDisplay.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.4)', betDisplay.style.fontSize = '22px', betDisplay.classList.remove('win-amount'), ball.style.transform = 'scale(1)';
  ball.style.transition = 'none', ball.style.opacity = '1', ball.classList.remove('inflating');
  const _0xefe7cf = document.querySelector('.explosion-container');
  if (_0xefe7cf) {
    _0xefe7cf.remove();
  }
  ballContainer.style.width = '500px', ballContainer.style.height = '200px';
});
function createStars() {
  const _0x152379 = document.getElementById('stars');
  const _0x484e71 = 50;
  for (let _0x19205e = 0; _0x19205e < _0x484e71; _0x19205e++) {
    const _0x553bb4 = document.createElement('div');
    _0x553bb4.className = 'star';
    const _0x4dc960 = Math.random() * 100,
      _0x5daf1f = Math.random() * 60;
    _0x553bb4.style.left = _0x4dc960 + '%', _0x553bb4.style.top = _0x5daf1f + '%';
    const _0x33f71d = 1 + Math.random() * 2;
    _0x553bb4.style.width = _0x33f71d + 'px', _0x553bb4.style.height = _0x33f71d + 'px';
    const _0xabeac8 = Math.random() * 5;
    _0x553bb4.style.animationDelay = _0xabeac8 + 's';
    const _0x23264b = 3 + Math.random() * 4;
    _0x553bb4.style.animationDuration = _0x23264b + 's', _0x152379.appendChild(_0x553bb4);
  }
}
window.addEventListener('load', createStars);