# 🎓 EduAble - Assistive Learning Platform

A fully functional assistive learning platform built with React + Vite (Frontend) and Node.js + Express (Backend).

## 📋 Features

### Frontend (Vite + React)
- **🔐 Authentication**: Login with localStorage persistence
- **🔊 Text to Speech**: Convert text to audio with file upload support
- **🎤 Speech to Text**: Record audio using Web Speech API
- **🤟 Sign Language Detection**: Live camera feed with frame capture
- **✨ Content Simplification**: Simplify complex text for neurodiverse users
- **♿ Accessibility**: ARIA labels, keyboard navigation, high contrast

### Backend (Express.js)
- **POST /api/tts**: Generate speech from text
- **POST /api/stt**: Process speech input
- **POST /api/sign**: Detect sign language (mock implementation)
- **POST /api/simplify**: Simplify content into bullets and flow steps
- **GET /health**: Health check endpoint

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Modern web browser with microphone/camera (for STT/Sign modules)

### 1️⃣ Frontend Setup

```bash
cd d:\Edu

# Install dependencies (if not already installed)
npm install

# Add react-router-dom if missing
npm install react-router-dom
```

**Frontend Dependencies Already Installed:**
- React
- React Router DOM
- Vite
- All Material-UI and Radix UI components

### 2️⃣ Backend Setup

```bash
cd d:\Edu\server

# Install dependencies
npm install

# Check if all packages are installed:
npm list
```

**Backend Dependencies:**
- express
- cors
- multer
- @google-cloud/text-to-speech
- @google-cloud/speech
- dotenv

### 3️⃣ Environment Configuration (Backend)

Create/Update `server/.env`:
```env
PORT=5000
GOOGLE_APPLICATION_CREDENTIALS=path/to/google/credentials.json
```

> **Note**: If you don't have Google Cloud credentials, the backend will still work with mock implementations.

---

## ▶️ Running the Application

### Option A: Run Both in Separate Terminals (Recommended)

**Terminal 1 - Frontend (Vite Dev Server):**
```bash
cd d:\Edu
npm run dev
```
Expected output:
```
  ➜  Local:   http://localhost:5173/
```

**Terminal 2 - Backend (Express Server):**
```bash
cd d:\Edu\server
npm start
```
Expected output:
```
✅ EduAble Backend running at http://localhost:5000
```

### Option B: Build Frontend for Production

```bash
cd d:\Edu
npm run build
```

This creates a `dist/` folder with production-ready files.

---

## 🧪 Testing the Application

### 1. **Access the App**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/health

### 2. **Login**
```
Email: admin@gmail.com
Password: admin123
```

### 3. **Test Each Module**

#### 🔊 Text to Speech
1. Enter text or upload a .txt file
2. Click "Generate Speech"
3. Listen to the audio
4. Optional: Download the audio file

#### 🎤 Speech to Text
1. Click "Start Recording"
2. Speak clearly into your microphone
3. Click "Stop Recording"
4. View transcribed text
5. Optional: Send transcript to backend

#### 🤟 Sign Language Detection
1. Click "Enable Camera"
2. Allow camera access
3. Position your hand for sign capture
4. Click "Capture Frame"
5. View detected sign result

#### ✨ Content Simplification
1. Paste or type complex text
2. Click "Simplify Text"
3. View:
   - Simplified text
   - Key points (bullets)
   - Process flow

---

## 📁 Project Structure

```
d:\Edu/
├── src/
│   ├── Approuter.jsx          ✅ Main routing with auth guard
│   ├── Dashboard.jsx           ✅ Main dashboard with 4 module buttons
│   ├── Login.jsx               ✅ Login page with validation
│   ├── modules/
│   │   ├── ModuleContainer.jsx ✅ Reusable component wrapper
│   │   ├── TTS.jsx             ✅ Text to Speech module
│   │   ├── STT.jsx             ✅ Speech to Text module
│   │   ├── Sign.jsx            ✅ Sign Language Detection module
│   │   └── Simplify.jsx        ✅ Content Simplification module
│   ├── App.jsx
│   └── main.tsx
├── server/
│   ├── index.js                ✅ Main Express app with all endpoints
│   ├── tts.js                  ✅ Google Cloud TTS integration
│   ├── stt.js                  ✅ Google Cloud Speech integration
│   ├── package.json
│   └── .env
├── package.json
└── vite.config.ts
```

---

## 🔧 API Endpoints Reference

### 1. Text to Speech
```bash
POST /api/tts
Content-Type: application/json

{
  "text": "Hello, this is a test message"
}

Response: Audio file (MP3)
```

### 2. Speech to Text
```bash
POST /api/stt
Content-Type: application/json

{
  "text": "Your transcribed text here"
}

Response:
{
  "text": "Your transcribed text here",
  "timestamp": "2026-02-11T..."
}
```

### 3. Sign Detection
```bash
POST /api/sign
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,..."
}

Response:
{
  "signLabel": "Hello",
  "confidence": "0.95",
  "timestamp": "2026-02-11T..."
}
```

### 4. Content Simplification
```bash
POST /api/simplify
Content-Type: application/json

{
  "text": "Complex text here..."
}

Response:
{
  "simplifiedText": "Simplified version...",
  "bullets": ["Point 1", "Point 2", "Point 3"],
  "flow": ["Step 1", "Step 2", "Step 3"],
  "originalLength": 500,
  "simplifiedLength": 250
}
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'react-router-dom'"
```bash
npm install react-router-dom
```

### Issue: Backend on port 5000 already in use
```bash
# Find process using port 5000
lsof -i :5000

# Or use a different port in server/.env
PORT=5001
```

### Issue: Google Cloud APIs not working
- Sign Language Detection and TTS/STT use mock implementations by default
- To enable actual Google Cloud integration:
  1. Create a GCP project
  2. Enable Speech-to-Text and Text-to-Speech APIs
  3. Create a service account key
  4. Set `GOOGLE_APPLICATION_CREDENTIALS` in `.env`

### Issue: Microphone not working in STT module
- Ensure browser has microphone permissions
- Check if HTTPS is required (most browsers require HTTPS for microphone access except localhost)

### Issue: Sign module camera permission denied
- Check browser camera permissions
- Try using HTTPS or localhost
- Some browsers may block camera access on non-secure origins

---

## 📦 Production Build

### Frontend
```bash
cd d:\Edu
npm run build

# Output: dist/ folder ready for deployment
```

### Backend
```bash
cd d:\Edu\server
npm start
```

For production, use a process manager:
```bash
npm install -g pm2
pm2 start server/index.js --name "eduable-backend"
pm2 save
pm2 startup
```

---

## 🔒 Security Notes

**Current Implementation:**
- Login uses hardcoded credentials (admin@gmail.com / admin123)
- No actual authentication/JWT tokens

**For Production:**
- Implement proper authentication (JWT, OAuth2, etc.)
- Store credentials securely
- Use HTTPS
- Validate all inputs on backend
- Implement rate limiting
- Add CSRF protection

---

## 🎨 Accessibility Features

✅ Large, clear buttons (minimum 44px height)
✅ ARIA labels and roles
✅ Keyboard navigation support
✅ High contrast colors
✅ aria-live regions for dynamic updates
✅ Semantic HTML structure

---

## 📝 License

This project is part of the EduAble initiative.

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify all setup steps are completed
3. Ensure both frontend and backend are running
4. Check browser console (F12) for errors

---

**🎓 Happy Learning with EduAble!**
