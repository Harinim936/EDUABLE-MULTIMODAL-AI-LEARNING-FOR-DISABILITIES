#!/usr/bin/env python3
"""
Text Simplification Training Script
Requirements: pip install transformers datasets torch
"""

from transformers import (
    T5Tokenizer, T5ForConditionalGeneration,
    Trainer, TrainingArguments, DataCollatorForSeq2Seq
)
from datasets import Dataset
import pandas as pd
from sklearn.model_selection import train_test_split

def load_simplification_dataset(file_path):
    """Load text simplification dataset"""
    data = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip() and not line.startswith('#'):
                if '|' in line:
                    complex_text, simple_text = line.split('|', 1)
                    data.append({
                        'input_text': f'simplify: {complex_text.strip()}',
                        'target_text': simple_text.strip()
                    })
    return data

def tokenize_function(examples, tokenizer, max_length=512):
    """Tokenize the input and target text"""
    inputs = tokenizer(
        examples['input_text'],
        max_length=max_length,
        truncation=True,
        padding='max_length'
    )

    targets = tokenizer(
        examples['target_text'],
        max_length=max_length,
        truncation=True,
        padding='max_length'
    )

    inputs['labels'] = targets['input_ids']
    return inputs

def train_simplification_model(dataset_path, output_dir='./simplification_model'):
    """Train text simplification model"""

    # Load and prepare data
    print("Loading dataset...")
    data = load_simplification_dataset(dataset_path)
    df = pd.DataFrame(data)

    # Split dataset
    train_df, val_df = train_test_split(df, test_size=0.1, random_state=42)

    # Convert to datasets
    train_dataset = Dataset.from_pandas(train_df)
    val_dataset = Dataset.from_pandas(val_df)

    # Load tokenizer and model
    print("Loading T5 model...")
    model_name = "t5-small"
    tokenizer = T5Tokenizer.from_pretrained(model_name)
    model = T5ForConditionalGeneration.from_pretrained(model_name)

    # Tokenize datasets
    print("Tokenizing datasets...")
    tokenized_train = train_dataset.map(
        lambda x: tokenize_function(x, tokenizer),
        batched=True,
        remove_columns=train_dataset.column_names
    )

    tokenized_val = val_dataset.map(
        lambda x: tokenize_function(x, tokenizer),
        batched=True,
        remove_columns=val_dataset.column_names
    )

    # Training arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=3,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=10,
        evaluation_strategy="steps",
        eval_steps=500,
        save_steps=500,
        save_total_limit=2,
        load_best_model_at_end=True,
    )

    # Data collator
    data_collator = DataCollatorForSeq2Seq(tokenizer, model=model)

    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_train,
        eval_dataset=tokenized_val,
        data_collator=data_collator,
        tokenizer=tokenizer,
    )

    # Train
    print("Starting training...")
    trainer.train()

    # Save model
    trainer.save_model(output_dir)
    tokenizer.save_pretrained(output_dir)
    print(f"Model saved to {output_dir}")

    return model, tokenizer

if __name__ == "__main__":
    train_simplification_model('text_simplification_dataset.txt')