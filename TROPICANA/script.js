let lastBettingTime = 0;
let tokenIndex = 0;

const tokens = [
    "demo",
    "demo",
    "demo"
];

function getAuthorizationToken() {
    const token = tokens[tokenIndex];
    tokenIndex = (tokenIndex + 1) % tokens.length;
    return `Bearer ${token}`;
}

function getRan(min, max) {
    return Math.random() * (max - min) + min;
}

async function checkSignal() {
    let randomNumber1 = getRan(1.1, 5.0).toFixed(2);
    const url = 'https://crash-gateway-cr.100hp.app/state?id_n=100hpgaming_tropicana&id_i=8';

    const response = await fetch(url, {
        headers: {
            'Authorization': getAuthorizationToken()
        }
    });

    const data = await response.json();
    const state = data.current_state;

    let responseTextEl = document.getElementById('responseText');
    if (!responseTextEl) {
        console.error('Element with ID responseText not found.');
        return;
    }

    if (state === "betting" && Date.now() - lastBettingTime > 5000) {
        let resultText = `${randomNumber1}x`;
        responseTextEl.textContent = resultText;
        responseTextEl.className = 'text prediction-value betting';
        lastBettingTime = Date.now();
    } else if (state === "ending") {
        responseTextEl.textContent = "Waiting..";
        responseTextEl.className = 'text prediction-value fly';
    } else if (state !== "betting") {
        if (responseTextEl.textContent !== "Waiting.." && !responseTextEl.classList.contains('betting')) {
        }
    }

}

function fetchDataAndUpdate() {
    const url = 'https://crash-gateway-cr.100hp.app/state?id_n=100hpgaming_tropicana';
    fetch(url, {
        headers: {
            'Authorization': getAuthorizationToken()
        }
    })
    .then(response => {
        if (!response.ok) {
            console.error('Network response was not ok for fetchDataAndUpdate:', response.statusText);
            return Promise.reject(response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const kef = parseFloat(data.current_coefficients);
        updateCoefficients(kef);
    })
    .catch(error => console.error('Error fetching data for coefficients:', error));
}

function updateCoefficients(coefficients) {
    const coefficientsDiv = document.getElementById('coefficients');
    if (!coefficientsDiv) {
        console.error('Element with ID coefficients not found.');
        return;
    }

    if (coefficients && coefficients !== 1) {
        coefficientsDiv.innerText = `x${coefficients.toFixed(2)}`;
        coefficientsDiv.className = 'text coefficient-value kif';
    } else {
        coefficientsDiv.innerText = "";
        coefficientsDiv.className = 'text coefficient-value smallt';
    }
}

fetchDataAndUpdate();
setInterval(fetchDataAndUpdate, 100);
let intervalId = setInterval(checkSignal, 100);
checkSignal();
