#!/usr/bin/env python3
"""
ASL Data Collection Script
Requirements: pip install opencv-python mediapipe pandas
"""

import cv2
import mediapipe as mp
import pandas as pd
import json
import time
from datetime import datetime

class ASLDataCollector:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        self.mp_draw = mp.solutions.drawing_utils

        self.data = []
        self.current_gesture = None
        self.collection_active = False

    def collect_gesture_data(self, gesture_name, num_samples=100):
        """Collect gesture data for a specific ASL gesture"""
        self.current_gesture = gesture_name
        self.collection_active = True

        cap = cv2.VideoCapture(0)
        collected = 0

        print(f"Collecting data for gesture: {gesture_name}")
        print(f"Press SPACE to start/stop collection, ESC to finish")

        while collected < num_samples:
            ret, frame = cap.read()
            if not ret:
                break

            # Flip frame horizontally for mirror effect
            frame = cv2.flip(frame, 1)
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # Process hand landmarks
            results = self.hands.process(rgb_frame)

            # Draw landmarks
            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    self.mp_draw.draw_landmarks(
                        frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS
                    )

                    # Collect landmark data if active
                    if self.collection_active and collected < num_samples:
                        landmarks = []
                        for lm in hand_landmarks.landmark:
                            landmarks.append({
                                'x': lm.x,
                                'y': lm.y,
                                'z': lm.z
                            })

                        self.data.append({
                            'gesture_name': gesture_name,
                            'landmarks_json': json.dumps(landmarks),
                            'timestamp': datetime.now().isoformat()
                        })
                        collected += 1
                        print(f"Sample {collected}/{num_samples} collected")

            # Display status
            status = f"Gesture: {gesture_name} | Samples: {collected}/{num_samples}"
            cv2.putText(frame, status, (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

            if self.collection_active:
                cv2.putText(frame, "COLLECTING", (10, 60),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

            cv2.imshow('ASL Data Collection', frame)

            key = cv2.waitKey(1) & 0xFF
            if key == 27:  # ESC
                break
            elif key == 32:  # SPACE
                self.collection_active = not self.collection_active
                if self.collection_active:
                    print("Started collecting...")
                else:
                    print("Paused collecting...")

        cap.release()
        cv2.destroyAllWindows()

        return collected

    def save_data(self, filename='asl_dataset.csv'):
        """Save collected data to CSV"""
        if not self.data:
            print("No data to save!")
            return

        df = pd.DataFrame(self.data)
        df.to_csv(filename, index=False)
        print(f"Saved {len(self.data)} samples to {filename}")

def main():
    collector = ASLDataCollector()

    gestures = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
                'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    print("ASL Gesture Data Collection")
    print("===========================")

    for gesture in gestures:
        samples = collector.collect_gesture_data(gesture, num_samples=50)
        print(f"Collected {samples} samples for {gesture}")

        # Ask to continue
        response = input(f"Continue to next gesture ({gesture})? (y/n): ")
        if response.lower() != 'y':
            break

    collector.save_data()

if __name__ == "__main__":
    main()