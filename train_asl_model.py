#!/usr/bin/env python3
"""
ASL Gesture Training Script
Requirements: pip install tensorflow pandas scikit-learn
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import json

def load_asl_dataset(csv_path):
    """Load ASL gesture dataset"""
    df = pd.read_csv(csv_path)
    X = []
    y = []

    for _, row in df.iterrows():
        landmarks = json.loads(row['landmarks_json'])
        # Flatten landmarks to feature vector
        features = []
        for lm in landmarks:
            features.extend([lm['x'], lm['y'], lm['z']])
        X.append(features)
        y.append(row['gesture_name'])

    return np.array(X), np.array(y)

def train_asl_model(dataset_path, model_path='asl_model.pkl'):
    """Train ASL gesture recognition model"""
    print("Loading ASL dataset...")
    X, y = load_asl_dataset(dataset_path)

    print(f"Dataset shape: {X.shape}")
    print(f"Classes: {np.unique(y)}")

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Train model
    print("Training model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    train_acc = model.score(X_train, y_train)
    test_acc = model.score(X_test, y_test)

    print(".3f")
    print(".3f")

    # Save model
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

    return model

if __name__ == "__main__":
    # Example usage
    train_asl_model('asl_dataset_template.csv')