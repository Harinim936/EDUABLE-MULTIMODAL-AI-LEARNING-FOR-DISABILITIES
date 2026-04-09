#!/usr/bin/env python3
"""
Text Simplification Data Collection Script
Interactive tool to create simplification training data
"""

import json
import os
from datetime import datetime

class SimplificationDataCollector:
    def __init__(self, output_file='text_simplification_dataset.txt'):
        self.output_file = output_file
        self.data = []

        # Load existing data if file exists
        if os.path.exists(output_file):
            self.load_existing_data()

    def load_existing_data(self):
        """Load existing simplification data"""
        try:
            with open(self.output_file, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.strip() and not line.startswith('#') and '|' in line:
                        complex_text, simple_text = line.split('|', 1)
                        self.data.append({
                            'complex': complex_text.strip(),
                            'simple': simple_text.strip()
                        })
            print(f"Loaded {len(self.data)} existing examples")
        except Exception as e:
            print(f"Error loading existing data: {e}")

    def collect_interactive(self):
        """Interactive data collection"""
        print("Text Simplification Data Collection")
        print("===================================")
        print("Enter complex text, then provide a simplified version.")
        print("Type 'quit' to finish, 'skip' to skip current example.")
        print()

        while True:
            complex_text = input("Complex text: ").strip()
            if complex_text.lower() == 'quit':
                break
            if not complex_text:
                continue

            simple_text = input("Simplified version: ").strip()
            if simple_text.lower() == 'quit':
                break
            if simple_text.lower() == 'skip':
                continue
            if not simple_text:
                print("Please provide a simplified version or type 'skip'")
                continue

            # Store the pair
            self.data.append({
                'complex': complex_text,
                'simple': simple_text,
                'timestamp': datetime.now().isoformat()
            })

            print(f"Added example #{len(self.data)}")
            print()

    def save_data(self):
        """Save collected data"""
        with open(self.output_file, 'w', encoding='utf-8') as f:
            f.write("# Text Simplification Dataset\n")
            f.write("# Format: complex_text|simplified_text\n")
            f.write(f"# Generated on {datetime.now().isoformat()}\n")
            f.write("# Total examples: " + str(len(self.data)) + "\n\n")

            for item in self.data:
                f.write(f"{item['complex']}|{item['simple']}\n")

        print(f"Saved {len(self.data)} examples to {self.output_file}")

    def show_statistics(self):
        """Show dataset statistics"""
        if not self.data:
            print("No data available")
            return

        complex_lengths = [len(item['complex'].split()) for item in self.data]
        simple_lengths = [len(item['simple'].split()) for item in self.data]

        print("
Dataset Statistics:")
        print(f"Total examples: {len(self.data)}")
        print(".1f")
        print(".1f")
        print(".1f")
        print(".1f")

def main():
    collector = SimplificationDataCollector()

    # Show existing statistics
    collector.show_statistics()

    # Collect new data
    collector.collect_interactive()

    # Save and show final statistics
    collector.save_data()
    collector.show_statistics()

if __name__ == "__main__":
    main()