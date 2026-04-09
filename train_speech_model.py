#!/usr/bin/env python3
"""
Speech Recognition Training Script
Requirements: pip install torch torchaudio transformers datasets
Note: This is a simplified example. Real STT training requires significant resources.
"""

import torch
import torchaudio
from transformers import (
    Wav2Vec2Processor, Wav2Vec2ForCTC,
    Trainer, TrainingArguments
)
from datasets import Dataset, Audio
import pandas as pd
import librosa
import numpy as np

def load_audio_dataset(csv_path, audio_dir='audio/'):
    """Load speech recognition dataset"""
    df = pd.read_csv(csv_path)

    data = []
    for _, row in df.iterrows():
        audio_path = f"{audio_dir}/{row['audio_file_path']}"
        try:
            # Load audio
            speech_array, sampling_rate = librosa.load(audio_path, sr=16000)
            data.append({
                'audio': {
                    'array': speech_array,
                    'sampling_rate': sampling_rate
                },
                'text': row['transcript']
            })
        except Exception as e:
            print(f"Error loading {audio_path}: {e}")

    return Dataset.from_list(data)

def prepare_dataset(batch, processor):
    """Prepare audio data for training"""
    audio = batch["audio"]

    # Process audio
    inputs = processor(
        audio["array"],
        sampling_rate=audio["sampling_rate"],
        return_tensors="pt",
        padding=True
    )

    # Process text
    with processor.as_target_processor():
        labels = processor(batch["text"], return_tensors="pt").input_ids

    inputs["labels"] = labels
    return inputs

def compute_metrics(pred):
    """Compute WER and CER metrics"""
    pred_logits = pred.predictions
    pred_ids = np.argmax(pred_logits, axis=-1)

    pred.label_ids[pred.label_ids == -100] = processor.tokenizer.pad_token_id

    pred_str = processor.batch_decode(pred_ids)
    label_str = processor.batch_decode(pred.label_ids, skip_special_tokens=True)

    # Simple character-level accuracy (simplified)
    correct_chars = sum(1 for p, l in zip(pred_str, label_str) if p.strip() == l.strip())
    return {"accuracy": correct_chars / len(pred_str)}

def train_speech_model(dataset_csv, audio_dir='audio/', output_dir='./speech_model'):
    """Train speech recognition model"""

    print("Loading dataset...")
    dataset = load_audio_dataset(dataset_csv, audio_dir)

    # Split dataset
    dataset = dataset.train_test_split(test_size=0.1, seed=42)

    # Load processor and model
    print("Loading Wav2Vec2 model...")
    model_name = "facebook/wav2vec2-base"
    processor = Wav2Vec2Processor.from_pretrained(model_name)
    model = Wav2Vec2ForCTC.from_pretrained(model_name)

    # Prepare datasets
    print("Preparing datasets...")
    dataset = dataset.map(
        lambda x: prepare_dataset(x, processor),
        remove_columns=dataset.column_names["train"]
    )

    # Training arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        group_by_length=True,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        gradient_accumulation_steps=2,
        evaluation_strategy="steps",
        num_train_epochs=30,
        save_steps=500,
        eval_steps=500,
        logging_steps=100,
        learning_rate=1e-4,
        warmup_steps=500,
        save_total_limit=2,
        load_best_model_at_end=True,
        metric_for_best_model="accuracy",
    )

    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset["train"],
        eval_dataset=dataset["test"],
        tokenizer=processor.feature_extractor,
        compute_metrics=compute_metrics,
    )

    # Train
    print("Starting training...")
    trainer.train()

    # Save model
    trainer.save_model(output_dir)
    processor.save_pretrained(output_dir)
    print(f"Model saved to {output_dir}")

    return model, processor

if __name__ == "__main__":
    # Note: This requires significant computational resources
    # train_speech_model('speech_dataset_template.csv')