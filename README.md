
📘 EduAble – Multimodal AI-Powered Accessible Learning Platform
🚀 Overview

EduAble is a multimodal AI-powered learning platform designed to support students with visual, hearing, mobility, and neurodiverse disabilities.

It integrates multiple assistive technologies like:

Gesture Recognition
Speech Recognition (STT)
Text-to-Speech (TTS)
Content Simplification (NLP)

👉 Providing a unified, accessible, and inclusive learning experience

⚙️ Features
🎥 Gesture & Sign Recognition
🎤 Speech-to-Text (Voice Commands)
🔊 Text-to-Speech (Audio Output)
🧠 Adaptive Content Simplification
🤖 AI Assistant
📝 Notes & Quiz System
📱 Cross-platform UI (Web & Mobile)
🛠️ Tech Stack
Frontend
React / React Native
HTML, CSS, JavaScript
Backend
Django
Django REST Framework
AI / ML
MediaPipe + OpenCV (Gesture Recognition)
CNN (Gesture Classification)
Whisper / DeepSpeech (STT)
Tacotron 2 / gTTS (TTS)
BERT (Content Simplification)
Database
PostgreSQL
📦 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/eduable.git
cd eduable
2️⃣ Backend Setup
cd backend
pip install -r requirements.txt
python manage.py runserver
3️⃣ Frontend Setup
cd frontend
npm install
npm start
🧹 Cleanup Commands
npm run clean              # Clean all build artifacts
npm run clean:frontend     # Clean frontend build files
npm run clean:backend      # Clean backend files
🔍 Project Structure
eduable/
├── backend/                  # Django Backend
│   ├── api/                  # REST APIs
│   ├── models/               # Database models
│   ├── views/                # Business logic
│   └── utils/                # AI integrations
│
├── frontend/                 # React / React Native UI
│   ├── components/           # UI components
│   ├── screens/              # App screens
│   ├── services/             # API calls
│   └── assets/               # Images & styles
│
├── ml-models/                # AI/ML models
│   ├── gesture/              # Gesture recognition
│   ├── speech/               # STT & TTS
│   └── nlp/                  # BERT models
│
├── datasets/                 # Training datasets
├── requirements.txt
└── README.md
🤖 Modules & Working
🎯 Gesture Recognition
Uses MediaPipe + OpenCV + CNN
Detects 21 hand landmarks
Classifies gestures in real-time
Enables touch-free navigation
🎤 Speech Recognition (STT)
Uses Whisper / DeepSpeech
Converts speech → text
Supports commands like:
“Open lesson”
“Next topic”
🔊 Text-to-Speech (TTS)
Uses Tacotron 2 + gTTS
Converts text → speech
Uses:
Mel-spectrogram
Vocoder for audio generation
🧠 Content Simplification
Uses BERT NLP model
Simplifies complex text
Improves readability for learners
🤖 AI Assistant
Chat-based support system
Helps with:
Learning queries
Navigation
Assistance
🧠 Algorithm Flow
Input → Processing → AI Model → Output → User Interaction

Example:

Camera → MediaPipe → CNN → Gesture → Navigation
📈 Future Enhancements
🌍 Multilingual support
📶 Offline functionality
🧤 Advanced gesture detection
⌚ Wearable device integration
📊 Learning analytics for teachers
🤝 Contribution

Contributions are welcome!

# Fork the repo
# Create a new branch
git checkout -b feature-name

# Commit changes
git commit -m "feat: add new feature"

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  
