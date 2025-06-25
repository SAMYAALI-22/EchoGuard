# EchoGuard - AI Mental Health Monitoring System

🧠 **EchoGuard** is an AI-powered mental health monitoring system that detects emotional states from voice input and provides crisis alerts when distress is detected.

## Features

### Frontend (React + TypeScript)
- 🎤 **Voice Recording**: Real-time audio capture with visual feedback
- 📊 **Dashboard**: Interactive emotional trends with Chart.js
- 🚨 **Crisis Detection**: Automatic alerts for mental health emergencies
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🎨 **Beautiful UI**: Modern, accessible design with smooth animations

### Backend (Python Flask)
- 🤖 **AI Analysis**: Sentiment analysis with crisis keyword detection
- 📞 **Alert System**: SMS notifications via Twilio (mock implementation)
- 💾 **Data Storage**: JSON-based storage (easily replaceable with real DB)
- 🔗 **REST API**: Complete API for frontend integration
- 🛡️ **CORS Enabled**: Cross-origin requests supported

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip

### Installation

1. **Clone and setup frontend:**
```bash
npm install
```

2. **Setup backend:**
```bash
cd backend
pip install -r requirements.txt
```

### Running the Application

1. **Start the backend:**
```bash
cd backend
python app.py
```
Backend runs on: http://localhost:5000

2. **Start the frontend:**
```bash
npm run dev
```
Frontend runs on: http://localhost:5173

## API Endpoints

### `POST /api/analyze`
Analyze emotional state from text/audio input
```json
{
  "mockText": "I'm feeling overwhelmed and hopeless today..."
}
```

### `GET /api/health`
Health check endpoint

### `GET /api/emotions`
Get all stored emotion records

### `DELETE /api/emotions/<id>`
Delete specific emotion record

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── pages/         # Main app pages
│   ├── context/       # React context for state
│   └── main.tsx       # App entry point
├── backend/
│   ├── app.py         # Flask server
│   ├── requirements.txt
│   └── data/          # JSON storage (auto-created)
└── README.md
```

## Upgrading to Production

### 1. Replace Mock Sentiment Analysis

**Option A: TextBlob (Simple)**
```python
from textblob import TextBlob

def analyze_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    # Convert polarity to emotion categories
```

**Option B: Transformers (Advanced)**
```python
from transformers import pipeline
classifier = pipeline("text-classification", 
                     model="j-hartmann/emotion-english-distilroberta-base")

def analyze_sentiment(text):
    result = classifier(text)
    return result[0]
```

**Option C: OpenAI API**
```python
import openai

def analyze_sentiment(text):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Analyze the emotional state: {text}",
        max_tokens=50
    )
    return response.choices[0].text
```

### 2. Implement Real Voice Transcription

```python
import openai

def transcribe_audio(audio_file):
    transcript = openai.Audio.transcribe("whisper-1", audio_file)
    return transcript["text"]
```

### 3. Add Twilio SMS Alerts

```python
from twilio.rest import Client

def send_crisis_alert(emotion_data):
    client = Client(account_sid, auth_token)
    message = client.messages.create(
        body=f"Crisis Alert: User needs immediate support",
        from_='+1234567890',
        to='+1987654321'
    )
    return message.sid
```

### 4. Database Integration

**PostgreSQL:**
```python
import psycopg2
from sqlalchemy import create_engine

engine = create_engine('postgresql://user:pass@localhost/echoguard')
```

**MongoDB:**
```python
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['echoguard']
```

## Environment Variables

Create `.env` file for production:
```env
OPENAI_API_KEY=your_openai_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
DATABASE_URL=your_database_url
EMERGENCY_CONTACT=+1987654321
```

## Security Considerations

- 🔒 **Data Encryption**: Encrypt sensitive voice data
- 🛡️ **HIPAA Compliance**: Ensure healthcare data compliance
- 🔐 **Authentication**: Add user authentication system
- 📝 **Audit Logs**: Track all crisis alerts and interventions
- 🌐 **HTTPS**: Use SSL certificates in production

## Mental Health Resources

- **Crisis Lifeline**: 988 (US)
- **Crisis Text Line**: Text HOME to 741741
- **Emergency**: 911
- **International**: befrienders.org

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

⚠️ **Important**: This is a demonstration application. For production use in healthcare settings, ensure proper medical supervision, regulatory compliance, and professional validation of AI models.

---

**EchoGuard** - Protecting mental health through AI innovation 🧠💙