import os
import pickle
import numpy as np
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model.p')

if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, 'rb') as f:
        model_dict = pickle.load(f)
        model = model_dict['model']
else:
    model = None
    print(f"Warning: {MODEL_PATH} not found. Please train the model first.")



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict_landmarks', methods=['POST'])
def predict_landmarks():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    data = request.json
    landmarks = data.get('landmarks')
    if not landmarks:
        return jsonify({'error': 'No landmark data'}), 400

    # Ensure we have exactly 42 features
    if len(landmarks) == 42:
        prediction = model.predict([np.asarray(landmarks)])
        predicted_character = str(prediction[0])
        return jsonify({'prediction': predicted_character})
    else:
        return jsonify({'prediction': '...', 'error': 'Inconsistent landmark count'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
