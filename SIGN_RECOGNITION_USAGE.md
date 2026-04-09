# Sign Recognition - Standalone Usage Guide

Two **completely standalone** solutions that don't interfere with your existing code.

---

## Solution 1: Standalone HTML File (Easiest)

Simply **open the HTML file directly** in your browser. No setup required.

```
File: sign-recognition-standalone.html
```

**Usage:**
1. Double-click `sign-recognition-standalone.html` 
2. Click "Start Camera"
3. Show your hand/gesture to the camera
4. Results appear instantly

**No modifications to your project needed!**

---

## Solution 2: JavaScript Module (For Integration)

For when you want to integrate sign recognition into your existing JavaScript project.

### Step 1: Include in HTML

```html
<body>
    <!-- Your existing code -->
    
    <!-- Add these elements -->
    <video id="video" style="display: none;" autoplay playsinline></video>
    <canvas id="canvas" width="640" height="480"></canvas>
    <div id="result"></div>

    <!-- Include the script -->
    <script src="sign-recognition.js"></script>
    
    <!-- Your app code -->
    <script>
        // Your code here
    </script>
</body>
```

### Step 2: Initialize in Your JavaScript

```javascript
// Initialize and start
SignRecognition.init({
    videoElementId: 'video',
    canvasElementId: 'canvas',
    onGestureDetected: (gesture) => {
        console.log('Gesture:', gesture);
        // Do something with the gesture
        document.getElementById('result').innerHTML = `
            <h2>${gesture.emoji} ${gesture.gesture}</h2>
            <p>${gesture.sentence}</p>
        `;
    },
    onHandDetected: (detected) => {
        console.log('Hand detected:', detected);
    },
    onError: (error) => {
        console.error('Error:', error);
    },
    onMessage: (msg) => {
        console.log('Message:', msg);
    }
});
```

### Step 3: Stop When Done

```javascript
// Stop the camera
SignRecognition.stop();
```

---

## Examples

### Example 1: Simple Node.js/Electron App

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App with Sign Recognition</title>
    <style>
        canvas { width: 100%; max-width: 600px; border: 2px solid #ccc; }
        #output { margin: 20px; padding: 10px; background: #f0f0f0; }
    </style>
</head>
<body>
    <h1>My Application</h1>
    
    <!-- Your existing HTML -->
    <div id="myContent">
        <!-- Your app content -->
    </div>

    <!-- Sign Recognition Elements -->
    <video id="video" style="display: none;" autoplay playsinline></video>
    <canvas id="canvas" width="640" height="480"></canvas>
    
    <button onclick="startRecognition()">Enable Sign Recognition</button>
    <button onclick="stopRecognition()">Disable Sign Recognition</button>
    
    <div id="output"></div>

    <!-- Include sign recognition -->
    <script src="sign-recognition.js"></script>
    
    <!-- Your application code -->
    <script>
        let recognitionActive = false;

        async function startRecognition() {
            try {
                await SignRecognition.init({
                    videoElementId: 'video',
                    canvasElementId: 'canvas',
                    onGestureDetected: (gesture) => {
                        console.log('Detected:', gesture.gesture);
                        // Handle gesture in your app
                        handleGesture(gesture);
                    },
                    onMessage: (msg) => {
                        document.getElementById('output').innerText = msg;
                    }
                });
                recognitionActive = true;
                document.getElementById('output').innerHTML = '<p>Sign Recognition Active</p>';
            } catch (error) {
                document.getElementById('output').innerHTML = '<p style="color:red;">Error: ' + error.message + '</p>';
            }
        }

        function stopRecognition() {
            SignRecognition.stop();
            recognitionActive = false;
            document.getElementById('output').innerHTML = '<p>Sign Recognition Stopped</p>';
        }

        function handleGesture(gesture) {
            // Do whatever you want with detected gestures
            console.log('Gesture detected:', gesture.gesture, gesture.emoji);
            document.getElementById('output').innerHTML = `
                <h3>${gesture.emoji} ${gesture.gesture}</h3>
                <p>${gesture.sentence}</p>
                <p>Confidence: ${Math.round(gesture.confidence * 100)}%</p>
            `;
        }

        // Example: Do something when specific gesture is detected
        let lastGesture = null;
        setInterval(() => {
            const current = SignRecognition.getLastGesture();
            if (current && current.gesture !== lastGesture) {
                console.log('New gesture:', current.gesture);
                lastGesture = current.gesture;
                // Perform action based on gesture
                performAction(current.gesture);
            }
        }, 100);

        function performAction(gesture) {
            switch (gesture) {
                case 'Thumbs Up':
                    console.log('User approved!');
                    break;
                case 'Thumbs Down':
                    console.log('User rejected!');
                    break;
                case 'Peace Sign':
                    console.log('User says thanks!');
                    break;
                case 'I Love You':
                    console.log('User is happy!');
                    break;
            }
        }
    </script>
</body>
</html>
```

### Example 2: Integration with Existing Django Backend

Your existing HTML template can just include the script:

```html
{% extends 'base.html' %}

{% block content %}
    <h1>My Page</h1>
    
    <!-- Your existing content -->
    <div id="main-content">
        <!-- Your page content -->
    </div>

    <!-- Add sign recognition separately -->
    <div style="margin-top: 40px; border-top: 2px solid #ccc; padding-top: 20px;">
        <h2>Sign Recognition</h2>
        <video id="video" style="display: none;" autoplay playsinline></video>
        <canvas id="canvas" width="640" height="480" style="width: 100%; max-width: 600px;"></canvas>
        <button id="toggleBtn" onclick="toggleRecognition()">Start Recognition</button>
        <div id="status"></div>
    </div>

    <script src="{% static 'sign-recognition.js' %}"></script>
    <script>
        let isActive = false;

        async function toggleRecognition() {
            if (!isActive) {
                try {
                    await SignRecognition.init({
                        videoElementId: 'video',
                        canvasElementId: 'canvas',
                        onGestureDetected: (gesture) => {
                            // Send to your Django backend
                            fetch('/api/gesture/', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    gesture: gesture.gesture,
                                    confidence: gesture.confidence
                                })
                            });
                        },
                        onMessage: (msg) => {
                            document.getElementById('status').innerText = msg;
                        }
                    });
                    document.getElementById('toggleBtn').innerText = 'Stop Recognition';
                    isActive = true;
                } catch (error) {
                    document.getElementById('status').innerText = 'Error: ' + error.message;
                }
            } else {
                SignRecognition.stop();
                document.getElementById('toggleBtn').innerText = 'Start Recognition';
                document.getElementById('status').innerText = 'Stopped';
                isActive = false;
            }
        }
    </script>
{% endblock %}
```

### Example 3: Use in Existing Express/Node.js App

In your `public/index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Node App with Sign Recognition</title>
</head>
<body>
    <h1>My Node.js Application</h1>
    
    <!-- Existing app content -->
    <div id="app"></div>

    <!-- Sign Recognition -->
    <section style="margin-top: 30px;">
        <h2>Gesture Control</h2>
        <video id="video" style="display: none;" autoplay playsinline></video>
        <canvas id="canvas" width="640" height="480" style="width: 100%; max-width: 600px; border: 1px solid #ccc;"></canvas>
        <p id="gestureInfo"></p>
    </section>

    <script src="/sign-recognition.js"></script>
    <script>
        // Initialize when page loads
        window.addEventListener('DOMContentLoaded', async () => {
            try {
                await SignRecognition.init({
                    videoElementId: 'video',
                    canvasElementId: 'canvas',
                    onGestureDetected: (gesture) => {
                        console.log('Detected gesture:', gesture);
                        updateUI(gesture);
                        
                        // Send to your backend API
                        fetch('/api/gestures', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(gesture)
                        });
                    }
                });
                console.log('Sign recognition initialized');
            } catch (error) {
                console.error('Failed to initialize:', error);
            }
        });

        function updateUI(gesture) {
            document.getElementById('gestureInfo').innerHTML = `
                <strong>${gesture.emoji} ${gesture.gesture}</strong><br>
                ${gesture.sentence}
            `;
        }

        // Cleanup on page close
        window.addEventListener('beforeunload', () => {
            SignRecognition.stop();
        });
    </script>
</body>
</html>
```

---

## API Reference

### SignRecognition.init(config)

Initialize sign recognition.

**Parameters:**
```javascript
{
    videoElementId: 'video',           // ID of video element
    canvasElementId: 'canvas',         // ID of canvas element
    onGestureDetected: (gesture) => {}, // Called when gesture detected
    onHandDetected: (detected) => {},  // Called when hand appears/disappears
    onError: (error) => {},            // Called on error
    onMessage: (msg) => {}             // Called for status updates
}
```

**Returns:** Promise<boolean>

### SignRecognition.stop()

Stop the camera and recognition.

### SignRecognition.getLastGesture()

Get the last detected gesture object.

### SignRecognition.isRunning()

Check if recognition is running.

### SignRecognition.classify(landmarks)

Classify hand landmarks directly (advanced).

---

## Gesture Object Structure

```javascript
{
    gesture: "Thumbs Up",                      // Gesture name
    sentence: "Yes, I agree with that.",       // Associated text
    confidence: 0.9,                           // Confidence 0-1
    emoji: "👍"                                // Associated emoji
}
```

---

## Supported Gestures

- ✋ **Open Palm** - "Please stop. Wait a moment."
- 👍 **Thumbs Up** - "Yes, I agree with that."
- 👎 **Thumbs Down** - "No, I do not agree."
- ✌️ **Peace Sign** - "Thank you very much!"
- 👊 **Fist** - "Great job! Well done!"
- 🤟 **I Love You** - "I love you. You are amazing."
- 🤟 **ASL Letter A** - "The letter A in sign language."
- 🤙 **ASL Letter I** - "The letter I in sign language."
- 🤙 **ASL Letter Y** - "The letter Y in sign language."

---

## Important Notes

✅ **No dependencies** - Only uses browser APIs  
✅ **No modifications needed** - Just include and use  
✅ **Completely isolated** - Doesn't affect your existing code  
✅ **100% standalone** - Works even if your project crashes  

---

## Troubleshooting

### Camera permission denied
- Allow camera in browser settings
- Check if HTTPS is required (some browsers need it)

### Gestures not detected
- Ensure good lighting
- Keep hand fully visible
- Move closer to camera
- Try different angles

### Slow performance
- Close other camera applications
- Reduce browser tabs/windows
- Try lower screen resolution

### Scripts fail to load
- Check internet connection
- MediaPipe uses CDN - may need firewall adjustment
- Check browser console for errors

---

**Choose the solution that fits your needs:**
- **Want it now?** → Use `sign-recognition-standalone.html`
- **Want integration?** → Use `sign-recognition.js` with the examples above
- **No modifications?** → Both work without changing your project!
