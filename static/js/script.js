// Theme & Core Management
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const video = document.getElementById('video');
const canvas = document.getElementById('output-canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const predictionText = document.getElementById('predicted-letter');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

let isStreaming = false;

function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
});

function getPrimaryColor() {
    return getComputedStyle(root).getPropertyValue('--primary').trim();
}

// Initialize Mediapipe Hands
const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults(onResults);

// System Clock
function updateClock() {
    const clockElement = document.getElementById('clock');
    if (clockElement) clockElement.innerText = new Date().toLocaleTimeString('en-GB', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

function onResults(results) {
    const primaryColor = getPrimaryColor();
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const handLandmarks = results.multiHandLandmarks[0];
        
        // Dynamic Schematic Drawing
        ctx.shadowBlur = 5;
        ctx.shadowColor = primaryColor; 
        
        drawConnectors(ctx, handLandmarks, HAND_CONNECTIONS, {
            color: primaryColor, 
            lineWidth: 1.5
        });

        drawLandmarks(ctx, handLandmarks, {
            color: primaryColor, 
            lineWidth: 0.5, 
            radius: 2
        });

        ctx.shadowBlur = 0;

        let data_aux = [];
        let x_ = [], y_ = [];
        for (const landmark of handLandmarks) {
            x_.push(landmark.x);
            y_.push(landmark.y);
        }
        const minX = Math.min(...x_), minY = Math.min(...y_);
        for (const landmark of handLandmarks) {
            data_aux.push(landmark.x - minX);
            data_aux.push(landmark.y - minY);
        }

        if (data_aux.length === 42) sendLandmarks(data_aux);
    } else {
        predictionText.innerText = "--";
        statusDot.classList.remove('active');
        statusText.innerText = "Searching...";
    }
    ctx.restore();
}

async function sendLandmarks(landmarks) {
    try {
        const response = await fetch('/predict_landmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ landmarks: landmarks })
        });
        const result = await response.json();
        if (result.prediction && result.prediction !== 'None') {
            predictionText.innerText = result.prediction;
            statusDot.classList.add('active');
            statusText.innerText = "Detecting...";
        }
    } catch (err) { console.error("Inference error:", err); }
}

// Initialize Camera
const camera = new Camera(video, {
    onFrame: async () => { if (isStreaming) await hands.send({image: video}); },
    width: 640,
    height: 480
});

startBtn.addEventListener('click', async () => {
    try {
        if (!isStreaming) {
            isStreaming = true;
            statusText.innerText = "Connecting...";
            await camera.start();
            startBtn.innerText = "Stop Camera";
            statusText.innerText = "Online";
        } else {
            await camera.stop();
            isStreaming = false;
            startBtn.innerText = "Start Camera";
            predictionText.innerText = "--";
            statusDot.classList.remove('active');
            statusText.innerText = "Offline";
        }
    } catch (e) {
        console.error("Camera error:", e);
        isStreaming = false;
    }
});
