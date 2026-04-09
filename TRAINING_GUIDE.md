# Training Requirements and Setup Guide

## Hardware Requirements
- **ASL Training**: 8GB RAM, modern CPU
- **Text Simplification**: 16GB RAM, GPU recommended (NVIDIA with CUDA)
- **Speech Recognition**: 32GB+ RAM, powerful GPU (24GB+ VRAM)

## Software Requirements
```bash
# For ASL Model
pip install scikit-learn pandas numpy joblib

# For Text Simplification
pip install transformers torch datasets accelerate

# For Speech Recognition
pip install transformers torch torchaudio datasets librosa
```

## Data Collection Guidelines

### ASL Gestures
- Record 1000+ samples per gesture
- Multiple angles and lighting conditions
- Different hand sizes and skin tones
- Real-time capture using MediaPipe

### Text Simplification
- 10,000+ complex-simple text pairs
- Various difficulty levels
- Domain-specific content (education, medical, legal)
- Multiple simplification styles

### Speech Recognition
- 100+ hours of audio
- Diverse speakers (age, accent, gender)
- Clean audio recordings
- Professional transcription

## Training Commands
```bash
# Train ASL model
python train_asl_model.py

# Train text simplification (requires GPU)
python train_simplification_model.py

# Train speech recognition (requires significant resources)
python train_speech_model.py
```

## Integration
After training, update the model paths in:
- `src/lib/sign-recognition-module.ts`
- `server/transformer_simplifier.py`
- `src/app/utils/sttUtils.ts`