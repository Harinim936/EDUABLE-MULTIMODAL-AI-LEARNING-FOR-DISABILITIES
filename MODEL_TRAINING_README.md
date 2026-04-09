# EduAble Model Training Guide

This guide explains how to train custom models for the EduAble accessibility application.

## Current Models (Pre-trained)

1. **Sign Recognition**: Rule-based ASL letter classification using MediaPipe landmarks
2. **Text Simplification**: T5-small model from Hugging Face
3. **Speech Recognition**: Browser Web Speech API

## Training Your Own Models

### Step 1: Data Collection

#### ASL Gesture Data
```bash
# Install dependencies
pip install opencv-python mediapipe pandas

# Run data collection
python collect_asl_data.py
```
This will create `asl_dataset.csv` with gesture landmarks.

#### Text Simplification Data
```bash
# Run interactive data collection
python collect_simplification_data.py
```
This creates `text_simplification_dataset.txt` with complex-simple text pairs.

#### Speech Recognition Data
Manual collection required:
- Record audio files (.wav format)
- Transcribe them accurately
- Create CSV with format: `audio_file_path|transcript|speaker_id`

### Step 2: Model Training

#### Train ASL Model
```bash
pip install scikit-learn pandas numpy joblib
python train_asl_model.py
```
Creates `asl_model.pkl` - replace the rule-based system in `sign-recognition-module.ts`

#### Train Text Simplification Model
```bash
pip install transformers torch datasets accelerate
python train_simplification_model.py
```
Creates `./simplification_model/` - update path in `transformer_simplifier.py`

#### Train Speech Recognition Model (Advanced)
```bash
pip install transformers torch torchaudio datasets librosa
python train_speech_model.py
```
**⚠️ Requires significant computational resources (GPU with 24GB+ VRAM)**

### Step 3: Integration

After training, update the model paths in your application:

#### For ASL Model:
```typescript
// In sign-recognition-module.ts
// Replace rule-based classifyASLLetter() with ML model inference
import * as tf from '@tensorflow/tfjs';
const model = await tf.loadLayersModel('path/to/asl_model.json');
```

#### For Text Simplification:
```python
# In transformer_simplifier.py
_generator = pipeline("text2text-generation",
                     model="./simplification_model",
                     device=-1)
```

#### For Speech Recognition:
```typescript
// In sttUtils.ts - replace Web Speech API with custom model
// This requires significant changes to use a custom STT model
```

## Dataset Requirements

### ASL Gestures
- **Minimum**: 500 samples per gesture
- **Recommended**: 1000+ samples per gesture
- **Gestures**: A-Z letters, numbers 0-9, common phrases
- **Diversity**: Multiple users, angles, lighting conditions

### Text Simplification
- **Minimum**: 5000 complex-simple pairs
- **Recommended**: 10,000+ pairs
- **Domains**: Educational content, medical terms, legal documents
- **Levels**: Various complexity levels

### Speech Recognition
- **Minimum**: 10 hours of audio
- **Recommended**: 100+ hours
- **Speakers**: Diverse ages, accents, genders
- **Quality**: Clean recordings, professional transcription

## Hardware Requirements

| Model Type | CPU | RAM | GPU | Storage |
|------------|-----|-----|-----|---------|
| ASL | Modern CPU | 8GB | Optional | 1GB |
| Text Simplification | Modern CPU | 16GB | Recommended | 5GB |
| Speech Recognition | High-end CPU | 32GB+ | Required (24GB+ VRAM) | 50GB+ |

## Cost Estimation

- **ASL Training**: ~$0 (local hardware)
- **Text Simplification**: ~$50-200 (cloud GPU)
- **Speech Recognition**: ~$500-2000+ (cloud GPU instances)

## Next Steps

1. Start with ASL gesture collection (easiest)
2. Collect text simplification data
3. Train models locally or on cloud GPUs
4. Integrate trained models into the application
5. Test and iterate on model performance

## Files Created

- `collect_asl_data.py` - ASL data collection script
- `collect_simplification_data.py` - Text simplification data collection
- `train_asl_model.py` - ASL model training
- `train_simplification_model.py` - Text simplification training
- `train_speech_model.py` - Speech recognition training
- `TRAINING_GUIDE.md` - Detailed training guide
- Dataset templates and examples