document.getElementById("get-signal").addEventListener("click", function() {
    generateSignal();
});

document.getElementById("get-signal-two").addEventListener("click", function() {
    generateSignal();
});

function generateSignal() {
    let randomSignal = (Math.random() * (1.77 - 1.2) + 1.2).toFixed(2); // Генерируем случайное число от 1.2 до 1.77
    let printSignalElement = document.getElementById("print-signal");
    printSignalElement.innerHTML = `<span>${randomSignal}</span>`;
    printSignalElement.classList.remove("deactivate");

    animateSignal();
}

function animateSignal() {
    let progressElement = document.getElementById("stop-progress");
    let timerElement = document.getElementById("stop-timer");
    let stopBlock = document.getElementById("stop-signal-time-block");
    
    stopBlock.classList.remove("deactivate");
    progressElement.style.width = "100%";
    timerElement.innerText = "3s";
    
    let duration = 3000;
    let interval = 50;
    let steps = duration / interval;
    let step = 100 / steps;
    let progress = 100;
    
    let countdown = setInterval(() => {
        progress -= step;
        progressElement.style.width = `${progress}%`;
        let remainingTime = (progress / 100 * 3).toFixed(1);
        timerElement.innerText = `${remainingTime}s`;
        
        if (progress <= 0) {
            clearInterval(countdown);
            stopBlock.classList.add("deactivate");
        }
    }, interval);
}