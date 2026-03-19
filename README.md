# HAND_AI.OS 🖐️⚙️

A high-performance, real-time hand gesture recognition platform designed with a sophisticated monochromatic "blueprint" aesthetic. `HAND_AI.OS` leverages the power of Mediapipe for sub-millisecond hand tracking and a lightweight Flask backend for intelligent gesture inference.

### 🚀 Key Features
*   **Real-time Inference**: Ultra-low latency hand tracking using client-side Mediapipe processing.
*   **Blueprint Aesthetic**: A monochromatic, technical UI inspired by Igloo.inc, featuring a quad-corner layout and schematic visualizations.
*   **Dynamic Theme Engine**: Seamlessly switch between **Light Mode** (Slate/Grey) and **Dark Mode** (Deep Navy/White) with persistent user preferences.
*   **High-Tech Visualization**: Skeletal landmarks are rendered as interactive technical schematics on a synchronized canvas.

### 🛠️ Tech Stack
*   **Frontend**: HTML5, Vanilla CSS (Dynamic Variables), JavaScript (ES6+).
*   **ML Engine**: Mediapipe Hands (Client-side).
*   **Backend**: Python, Flask.
*   **Libraries**: OpenCV, Scikit-Learn, NumPy.

### 📁 Project Structure
- `app.py`: Flask web application and inference API.
- `static/js/script.js`: Core client-side logic for Mediapipe and UI interaction.
- `static/css/style.css`: Dynamic theme-aware technical styling.
- `templates/index.html`: Main Igloo-inspired interface.
- `model.p`: Pre-trained gesture recognition model.

### 📖 How to Run

#### 1. Activate Environment
```powershell
.\venv\Scripts\Activate.ps1
```

#### 2. Install Dependencies
```bash
pip install flask opencv-python mediapipe scikit-learn numpy
```

#### 3. Start the Server
```bash
python app.py
```
Visit `http://127.0.0.1:5000` in your browser.

---

### ☁️ Deployment

#### Deploying to Vercel
This project is configured for one-click deployment to Vercel:
1.  **Install Vercel CLI**: `npm i -g vercel`
2.  **Login**: `vercel login`
3.  **Deploy**: `vercel --prod`

> [!IMPORTANT]
> Vercel has a 250MB limit for serverless functions. Because `mediapipe` and `opencv` are large, you may need to use **Render** or **Railway** if your deployment exceeds this limit.

---

### 🔥 Development History
Originally started as a simple Scikit-Learn script, `HAND_AI.OS` evolved into a full-scale web application focusing on high-end UI/UX and seamless real-time interaction.
