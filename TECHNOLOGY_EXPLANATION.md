# How EduAble Technologies Work (No gTTS, gSTT, or BERT)

## ❌ What This Project DOESN'T Use

### No gTTS (Google Text-to-Speech)
- **What it is**: Python library that calls Google's TTS API
- **Why not used**: Requires API keys, internet connection, costs money
- **What we use instead**: Browser's built-in `SpeechSynthesis` API

### No gSTT (Google Speech-to-Text)
- **What it is**: Google Cloud Speech-to-Text service
- **Why not used**: Requires API keys, internet connection, costs money
- **What we use instead**: Browser's built-in `SpeechRecognition` API

### No BERT (Bidirectional Encoder Representations from Transformers)
- **What it is**: NLP model for understanding text context
- **Why not used**: Complex to fine-tune, resource intensive
- **What we use instead**: T5 (Text-to-Text Transfer Transformer)

---

## ✅ What This Project ACTUALLY Uses

### 1. 🎵 Text-to-Speech (TTS) - Browser API

**Location**: `src/app/utils/speak.ts`

```typescript
export const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
};
```

**How it works**:
1. Creates `SpeechSynthesisUtterance` object with your text
2. Sets language to English, speed to 90%, normal pitch
3. Calls `window.speechSynthesis.speak()` - built into browser
4. Browser's speech engine converts text to audio
5. Audio plays through your speakers/headphones

**Pros**: Free, no API keys, works offline, instant
**Cons**: Limited voices, quality varies by browser/OS

### 2. 🎤 Speech-to-Text (STT) - Browser API

**Location**: `src/app/utils/sttUtils.ts`

```typescript
const SpeechRecognition = (window as any).SpeechRecognition ||
                         (window as any).webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';
```

**How it works**:
1. Browser accesses your microphone (with permission)
2. Audio stream sent to browser's speech recognition engine
3. Engine processes audio in real-time
4. Returns text transcript as you speak
5. Supports continuous listening with interim results

**Pros**: Free, works offline, real-time, no server calls
**Cons**: Accuracy depends on browser, limited language support

### 3. 📝 Text Simplification - T5 Model

**Location**: `server/transformer_simplifier.py`

```python
_generator = pipeline("text2text-generation", model="t5-small", device=-1)

@app.post("/generate")
def generate(payload: TextIn):
    text = payload.text
    prompt = f"simplify: {text.strip()}"
    outputs = gen(prompt, max_length=256, num_return_sequences=1)
    simplified = outputs[0]["generated_text"]
```

**How it works**:
1. Uses Hugging Face Transformers library
2. Loads pre-trained T5-small model (60 million parameters)
3. Adds "simplify:" prefix to input text
4. Model generates simplified version
5. Returns shorter, easier-to-understand text

**Pros**: Good quality, works offline, customizable
**Cons**: Requires Python/server, model is 60MB download

---

## 🔄 Data Flow in EduAble

### Voice Navigation Flow:
```
User speaks → Browser STT API → Text command → Navigation action → TTS feedback
```

### Text Simplification Flow:
```
Complex text → Frontend → Python server → T5 model → Simplified text → Frontend display
```

### Sign Recognition Flow:
```
Camera → MediaPipe Hands → Landmark detection → Rule-based classification → Gesture result
```

---

## 💰 Cost Comparison

| Technology | EduAble Approach | Google/Cloud Alternative |
|------------|------------------|--------------------------|
| TTS | Free (browser) | $0.000016/second (gTTS) |
| STT | Free (browser) | $0.006/minute (gSTT) |
| Text Simp. | Free (T5 local) | $0.0001/request (BERT API) |

---

## 🚀 Why This Design?

1. **Zero Cost**: No API calls, no cloud bills
2. **Privacy**: Audio/text stays on user's device
3. **Offline**: Works without internet (except model download)
4. **Simple**: No API keys, authentication, or quotas
5. **Accessible**: Works on any modern browser

The project prioritizes **accessibility and simplicity** over cutting-edge AI, making it perfect for educational use where reliability and zero cost are crucial.