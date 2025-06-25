import os
import json
import uuid
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

# Load HuggingFace sentiment analysis model
sentiment_pipeline = pipeline("sentiment-analysis")

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Emotion analyzer using real AI
def analyze_sentiment(text):
    """
    Uses Hugging Face Transformers to detect sentiment.
    """
    result = sentiment_pipeline(text)[0]
    label = result['label']
    score = result['score']

    # Crisis keyword detection
    crisis_keywords = [
        'suicide', 'kill myself', 'end it all', 'no point', 'hopeless',
        'worthless', 'can\'t go on', 'want to die', 'harm myself'
    ]
    is_crisis = any(keyword in text.lower() for keyword in crisis_keywords)

    # Convert label to emotion
    if 'POSITIVE' in label:
        emotion = 'happy'
    elif 'NEGATIVE' in label:
        emotion = 'sad'
    else:
        emotion = 'neutral'

    return {
        'emotion': emotion,
        'confidence': score,
        'is_crisis': is_crisis
    }

def send_crisis_alert(emotion_data):
    """
    Mock crisis alert function (prints instead of real SMS).
    """
    print("🚨 Distress detected! Simulating SMS alert to +91XXXXXXXXXX 🚨")
    print(f"🚨 CRISIS ALERT TRIGGERED 🚨")
    print(f"Timestamp: {emotion_data['timestamp']}")
    print(f"Emotion: {emotion_data['emotion']} (Confidence: {emotion_data['confidence']:.2f})")
    print(f"Text: {emotion_data['text']}")
    print(f"Crisis Level: {'HIGH' if emotion_data['is_crisis'] else 'MODERATE'}")
    print("Emergency contact would be notified via SMS/Email")
    print("-" * 50)
    return True

def save_emotion_data(emotion_data):
    """
    Save emotion data to a JSON file (mock database).
    """
    try:
        os.makedirs('data', exist_ok=True)
        data_file = 'data/emotions.json'

        # Load or initialize list
        if os.path.exists(data_file):
            with open(data_file, 'r') as f:
                emotions = json.load(f)
        else:
            emotions = []

        # Append and save
        emotions.append(emotion_data)
        with open(data_file, 'w') as f:
            json.dump(emotions, f, indent=2, default=str)

        return True
    except Exception as e:
        print(f"Error saving data: {e}")
        return False

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'EchoGuard backend is running.',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_emotion():
    try:
        data = request.get_json()
        text = data.get('mockText', '').strip()

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        analysis = analyze_sentiment(text)

        emotion_data = {
            'id': str(uuid.uuid4()),
            'timestamp': datetime.now().isoformat(),
            'text': text,
            'emotion': analysis['emotion'],
            'confidence': analysis['confidence'],
            'is_crisis': analysis['is_crisis']
        }

        save_emotion_data(emotion_data)

        if analysis['is_crisis']:
            send_crisis_alert(emotion_data)

        return jsonify({
            'success': True,
            'data': emotion_data,
            'analysis': analysis,
            'crisis_alert_sent': analysis['is_crisis']
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/emotions', methods=['GET'])
def get_emotions():
    try:
        data_file = 'data/emotions.json'
        if os.path.exists(data_file):
            with open(data_file, 'r') as f:
                emotions = json.load(f)
            return jsonify({'success': True, 'data': emotions})
        return jsonify({'success': True, 'data': []})
    except Exception as e:
        print(f"Error reading emotions: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/emotions/<emotion_id>', methods=['DELETE'])
def delete_emotion(emotion_id):
    try:
        data_file = 'data/emotions.json'
        if not os.path.exists(data_file):
            return jsonify({'error': 'No emotions found'}), 404

        with open(data_file, 'r') as f:
            emotions = json.load(f)

        emotions = [e for e in emotions if e['id'] != emotion_id]

        with open(data_file, 'w') as f:
            json.dump(emotions, f, indent=2, default=str)

        return jsonify({'success': True, 'message': 'Emotion deleted'})
    except Exception as e:
        print(f"Error deleting emotion: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🚀 Starting EchoGuard Backend with HuggingFace Transformers...")
    print("📊 Real sentiment analysis enabled")
    print("🚨 Crisis detection active")
    print("💾 JSON storage backend")
    print("-" * 50)

    os.makedirs('data', exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000)