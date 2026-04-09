/**
 * Sign Recognition Engine - Standalone JavaScript
 * No dependencies, no modifications needed to existing code
 * Just include this file and call SignRecognition.init()
 */

const SignRecognition = (() => {
    // Finger indices
    const FINGER_TIPS = [4, 8, 12, 16, 20];
    const FINGER_PIPS = [3, 6, 10, 14, 18];
    const FINGER_MCPS = [2, 5, 9, 13, 17];

    // State
    let state = {
        isRunning: false,
        mediaStream: null,
        hands: null,
        camera: null,
        lastGesture: null,
        callbacks: {
            onGestureDetected: null,
            onHandDetected: null,
            onError: null,
            onMessage: null
        }
    };

    // Finger detection helpers
    function isFingerExtended(landmarks, fingerIdx) {
        const tip = landmarks[FINGER_TIPS[fingerIdx]];
        const pip = landmarks[FINGER_PIPS[fingerIdx]];
        const mcp = landmarks[FINGER_MCPS[fingerIdx]];

        if (fingerIdx === 0) {
            return Math.abs(tip.x - mcp.x) > Math.abs(pip.x - mcp.x) * 1.2;
        }
        return tip.y < pip.y;
    }

    function isFingerHalfCurled(landmarks, fingerIdx) {
        const tip = landmarks[FINGER_TIPS[fingerIdx]];
        const pip = landmarks[FINGER_PIPS[fingerIdx]];
        return Math.abs(tip.y - pip.y) < 0.04;
    }

    function getExtendedFingers(landmarks) {
        return [0, 1, 2, 3, 4].map(i => isFingerExtended(landmarks, i));
    }

    function dist(landmarks, a, b) {
        const la = landmarks[a];
        const lb = landmarks[b];
        return Math.sqrt((la.x - lb.x) ** 2 + (la.y - lb.y) ** 2);
    }

    // ASL Letter classification
    function classifyASLLetter(landmarks) {
        const extended = getExtendedFingers(landmarks);
        const [thumb, index, middle, ring, pinky] = extended;

        const thumbTip = landmarks[4];
        const indexMcp = landmarks[5];

        // A: Fist with thumb alongside
        if (!index && !middle && !ring && !pinky) {
            if (thumbTip.y < indexMcp.y && thumbTip.x < indexMcp.x + 0.05) {
                return { gesture: "ASL Letter A", sentence: "The letter A in sign language.", confidence: 0.8, emoji: "🤟" };
            }
        }

        // I: Only pinky extended
        if (!thumb && !index && !middle && !ring && pinky) {
            return { gesture: "ASL Letter I", sentence: "The letter I in sign language.", confidence: 0.85, emoji: "🤙" };
        }

        // Y: Thumb + pinky extended
        if (thumb && !index && !middle && !ring && pinky) {
            return { gesture: "ASL Letter Y", sentence: "The letter Y in sign language.", confidence: 0.85, emoji: "🤙" };
        }

        return null;
    }

    // Main gesture classification
    function classifyGesture(landmarks) {
        const extended = getExtendedFingers(landmarks);
        const [thumb, index, middle, ring, pinky] = extended;
        const extCount = extended.filter(Boolean).length;

        // Try ASL letter
        const aslLetter = classifyASLLetter(landmarks);
        if (aslLetter) return aslLetter;

        // Common gestures
        if (extCount === 5) {
            return { gesture: "Open Palm", sentence: "Please stop. Wait a moment.", confidence: 0.9, emoji: "✋" };
        }

        if (thumb && index && !middle && !ring && pinky) {
            return { gesture: "I Love You", sentence: "I love you. You are amazing.", confidence: 0.85, emoji: "🤟" };
        }

        if (index && middle && extCount === 2) {
            return { gesture: "Peace Sign", sentence: "Thank you very much!", confidence: 0.85, emoji: "✌️" };
        }

        if (!thumb && !index && !middle && !ring && !pinky) {
            return { gesture: "Fist", sentence: "Great job! Well done!", confidence: 0.85, emoji: "👊" };
        }

        if (thumb && !index && !middle && !ring && !pinky) {
            return { gesture: "Thumbs Up", sentence: "Yes, I agree with that.", confidence: 0.9, emoji: "👍" };
        }

        return { gesture: "Unknown", sentence: "", confidence: 0.0, emoji: "❓" };
    }

    // Load MediaPipe scripts
    async function loadMediaPipeScripts() {
        return new Promise((resolve, reject) => {
            const scripts = [
                'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js'
            ];

            let loaded = 0;
            scripts.forEach(src => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    loaded++;
                    if (loaded === scripts.length) resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = src;
                script.crossOrigin = 'anonymous';
                script.onload = () => {
                    loaded++;
                    if (loaded === scripts.length) resolve();
                };
                script.onerror = () => reject(new Error(`Failed to load ${src}`));
                document.head.appendChild(script);
            });
        });
    }

    // Public API
    return {
        /**
         * Initialize and start sign recognition
         */
        async init(config = {}) {
            try {
                const {
                    videoElementId = 'video',
                    canvasElementId = 'canvas',
                    onGestureDetected = null,
                    onHandDetected = null,
                    onError = null,
                    onMessage = null
                } = config;

                state.callbacks.onGestureDetected = onGestureDetected;
                state.callbacks.onHandDetected = onHandDetected;
                state.callbacks.onError = onError;
                state.callbacks.onMessage = onMessage;

                if (state.callbacks.onMessage) {
                    state.callbacks.onMessage('Loading MediaPipe...');
                }

                await loadMediaPipeScripts();

                const videoEl = document.getElementById(videoElementId);
                const canvasEl = document.getElementById(canvasElementId);

                if (!videoEl || !canvasEl) {
                    throw new Error(`Could not find elements: video="${videoElementId}", canvas="${canvasElementId}"`);
                }

                const Hands = window.Hands;
                if (!Hands) throw new Error('MediaPipe Hands not available');

                state.hands = new Hands({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
                });

                state.hands.setOptions({
                    maxNumHands: 1,
                    modelComplexity: 1,
                    minDetectionConfidence: 0.7,
                    minTrackingConfidence: 0.5,
                });

                if (state.callbacks.onMessage) {
                    state.callbacks.onMessage('Starting camera...');
                }

                state.mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: 640, height: 480 }
                });

                videoEl.srcObject = state.mediaStream;

                const ctx = canvasEl.getContext('2d');
                let gestureStable = '';
                let gestureCount = 0;

                state.hands.onResults((results) => {
                    canvasEl.width = canvasEl.offsetWidth;
                    canvasEl.height = (canvasEl.offsetWidth / 640) * 480;
                    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

                    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                        const landmarks = results.multiHandLandmarks[0];

                        // Draw landmarks
                        if (window.drawConnectors && window.HAND_CONNECTIONS) {
                            window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
                                color: 'hsl(174, 72%, 50%)',
                                lineWidth: 2
                            });
                        }
                        if (window.drawLandmarks) {
                            window.drawLandmarks(ctx, landmarks, {
                                color: 'hsl(260, 60%, 60%)',
                                lineWidth: 1,
                                radius: 3
                            });
                        }

                        if (state.callbacks.onHandDetected) {
                            state.callbacks.onHandDetected(true);
                        }

                        // Classify
                        const gesture = classifyGesture(landmarks);
                        state.lastGesture = gesture;

                        // Stabilize
                        if (gesture.gesture === gestureStable) {
                            gestureCount++;
                        } else {
                            gestureStable = gesture.gesture;
                            gestureCount = 1;
                        }

                        if (gestureCount === 8 && gesture.gesture !== 'Unknown') {
                            if (state.callbacks.onGestureDetected) {
                                state.callbacks.onGestureDetected(gesture);
                            }
                            gestureCount = 0;
                        }
                    } else {
                        if (state.callbacks.onHandDetected) {
                            state.callbacks.onHandDetected(false);
                        }
                    }
                });

                const Camera = window.Camera;
                if (!Camera) throw new Error('MediaPipe Camera not available');

                state.camera = new Camera(window, {
                    onFrame: async () => {
                        await state.hands.send({ image: videoEl });
                    },
                    width: 640,
                    height: 480
                });

                state.camera.start();
                state.isRunning = true;

                if (state.callbacks.onMessage) {
                    state.callbacks.onMessage('Camera running - show your hand!');
                }

                return true;
            } catch (error) {
                console.error('Sign Recognition Error:', error);
                if (state.callbacks.onError) {
                    state.callbacks.onError(error);
                }
                throw error;
            }
        },

        /**
         * Stop the recognition
         */
        stop() {
            if (state.camera) state.camera.stop();
            if (state.mediaStream) {
                state.mediaStream.getTracks().forEach(track => track.stop());
                state.mediaStream = null;
            }
            state.isRunning = false;
        },

        /**
         * Get last detected gesture
         */
        getLastGesture() {
            return state.lastGesture;
        },

        /**
         * Check if running
         */
        isRunning() {
            return state.isRunning;
        },

        /**
         * Classify landmarks manually
         */
        classify(landmarks) {
            return classifyGesture(landmarks);
        }
    };
})();

// Auto-cleanup on page unload
window.addEventListener('beforeunload', () => {
    SignRecognition.stop();
});
