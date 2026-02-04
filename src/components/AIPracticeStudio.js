import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const POSE_CONFIG = {
    mountain: {
        name: "Mountain Pose",
        description: "Stand tall, feet together, shoulders relaxed, arms by side.",
        check: (landmarks, getAngle) => {
            let score = 100;
            let messages = [];

            const leftLeg = getAngle(landmarks[23], landmarks[25], landmarks[27]);
            const rightLeg = getAngle(landmarks[24], landmarks[26], landmarks[28]);
            const shoulderWidth = Math.abs(landmarks[11].x - landmarks[12].x);
            const shoulderTilt = Math.abs(landmarks[11].y - landmarks[12].y) / shoulderWidth;

            if (leftLeg < 165 || rightLeg < 165) {
                score -= 20;
                messages.push("Straighten your legs");
            }
            if (shoulderTilt > 0.1) {
                score -= 10;
                messages.push("Level your shoulders");
            }
            return { score, feedback: messages.join(". ") || "Perfect form!" };
        }
    },
    tree: {
        name: "Tree Pose",
        description: "Balance on one leg, place other foot on inner thigh, hands in prayer.",
        check: (landmarks, getAngle) => {
            let score = 100;
            let messages = [];

            // Check standing leg (we'll assume left is standing for simplicity or check which is straighter)
            // Ideally, detect which leg is straight (standing) and which is bent (lifted)
            const leftKnee = getAngle(landmarks[23], landmarks[25], landmarks[27]);

            // Simplified: Expect at least one leg straight (> 165)
            // And hands brought together (wrist distance small)

            const wristDist = Math.abs(landmarks[15].x - landmarks[16].x);

            if (leftKnee < 160) { // Assuming left leg standing
                // Try right leg
                const rightKnee = getAngle(landmarks[24], landmarks[26], landmarks[28]);
                if (rightKnee < 160) {
                    score -= 30;
                    messages.push("Straighten your standing leg");
                }
            }

            // Hands check (visually approx)
            if (wristDist > 0.15) {
                score -= 10;
                messages.push("Bring your palms together");
            }

            return { score, feedback: messages.join(". ") || "Great balance!" };
        }
    },
    warrior2: {
        name: "Warrior II",
        description: "Wide stance, lunge front knee 90°, arms horizontal gaze forward.",
        check: (landmarks, getAngle) => {
            let score = 100;
            let messages = [];

            // Check arms horizontal (shoulders to elbows to wrists)
            // Angle 11-13-15 and 12-14-16 should be ~180
            const leftArm = getAngle(landmarks[11], landmarks[13], landmarks[15]);
            const rightArm = getAngle(landmarks[12], landmarks[14], landmarks[16]);

            if (leftArm < 160 || rightArm < 160) {
                score -= 15;
                messages.push("Extend your arms fully");
            }

            // Check lunge (one knee bent ~90, other ~180)
            const leftKnee = getAngle(landmarks[23], landmarks[25], landmarks[27]);
            const rightKnee = getAngle(landmarks[24], landmarks[26], landmarks[28]);

            // Detect which is lunging
            const isLeftLunging = leftKnee < 135;
            const isRightLunging = rightKnee < 135;

            if (!isLeftLunging && !isRightLunging) {
                score -= 30;
                messages.push("Bend your front knee deeper");
            }

            return { score, feedback: messages.join(". ") || "Strong Warrior!" };
        }
    }
};

const AIPracticeStudio = () => {
    const [isPracticing, setIsPracticing] = useState(false);
    const [currentPose, setCurrentPose] = useState('mountain');
    const [feedback, setFeedback] = useState('Select a pose and start practice');
    const [score, setScore] = useState(0);
    const [duration, setDuration] = useState(0);
    const [cameraPermission, setCameraPermission] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const cameraRef = useRef(null);
    const poseRef = useRef(null);
    const timerRef = useRef(null);
    const lastSpeakTime = useRef(0);

    // Voice Feedback Helper
    const speak = (text) => {
        const now = Date.now();
        if (now - lastSpeakTime.current > 3000) { // Don't speak too often
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
            lastSpeakTime.current = now;
        }
    };

    useEffect(() => {
        // Initialize MediaPipe Pose
        if (window.Pose) {
            const pose = new window.Pose({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                }
            });

            pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            pose.onResults(onResults);
            poseRef.current = pose;
        }

        return () => {
            stopPractice(); // Cleanup on unmount
        };
    }, []);
    // Actually currentPose is used in onResults. we need onResults to reference current state.
    // Better to use a ref for currentPose or re-bind. 

    // Use ref to access current pose inside callback without re-binding
    const currentPoseRef = useRef(currentPose);
    useEffect(() => {
        currentPoseRef.current = currentPose;
    }, [currentPose]);


    const onResults = (results) => {
        if (!canvasRef.current) return;
        const canvasCtx = canvasRef.current.getContext('2d');
        const { width, height } = canvasRef.current;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, width, height);
        canvasCtx.drawImage(results.image, 0, 0, width, height);

        if (results.poseLandmarks) {
            if (window.drawConnectors && window.drawLandmarks) {
                window.drawConnectors(canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
                window.drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });
            }
            calculatePoseAccuracy(results.poseLandmarks);
        }
        canvasCtx.restore();
    };

    const calculatePoseAccuracy = (landmarks) => {
        const getAngle = (a, b, c) => {
            const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
            let angle = Math.abs(radians * 180.0 / Math.PI);
            if (angle > 180.0) angle = 360 - angle;
            return angle;
        };

        const poseLogic = POSE_CONFIG[currentPoseRef.current];
        if (poseLogic) {
            const result = poseLogic.check(landmarks, getAngle);

            // Smooth score changes? For now just set.
            setScore(prev => Math.round((prev * 0.8) + (result.score * 0.2))); // Simple smoothing

            setFeedback(result.feedback);
            if (result.score < 70) speak(result.feedback);
        }
    };

    const startPractice = () => {
        if (!window.Camera) {
            setFeedback("Error: MediaPipe not loaded.");
            return;
        }

        setIsPracticing(true);
        setDuration(0);
        setScore(0);

        // Start Timer
        const startTime = Date.now();
        timerRef.current = setInterval(() => {
            setDuration(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        // Start Camera
        const camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
                if (poseRef.current) await poseRef.current.send({ image: videoRef.current });
            },
            width: 1280,
            height: 720
        });
        cameraRef.current = camera;
        camera.start().then(() => setCameraPermission('granted')).catch(() => setCameraPermission('denied'));
    };

    const stopPractice = async () => {
        setIsPracticing(false);
        if (cameraRef.current) cameraRef.current.stop();
        if (timerRef.current) clearInterval(timerRef.current);

        // Save Session
        if (duration > 5) { // Only save if practiced > 5 seconds
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const token = JSON.parse(userStr).token;
                    await fetch('http://localhost:8080/api/ai-practice/sessions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            pose_name: POSE_CONFIG[currentPose].name,
                            duration_seconds: duration,
                            accuracy_score: score
                        })
                    });
                    setFeedback("Session saved successfully!");
                }
            } catch (e) {
                console.error("Failed to save session", e);
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="min-h-screen bg-earth-100 pt-32 pb-12 px-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold font-primary text-earth-900">AI Yoga Studio</h1>
                    <Link to="/ai-practice/stats" className="px-6 py-2 bg-white border-2 border-accent text-accent rounded-full font-bold hover:bg-accent hover:text-white transition-colors">
                        View Progress
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Area */}
                    <div className="lg:w-2/3">
                        <div className="bg-black rounded-2xl shadow-xl overflow-hidden relative min-h-[480px] flex items-center justify-center">
                            {!isPracticing && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 text-white p-8 text-center backdrop-blur-sm">
                                    <h2 className="text-3xl font-bold mb-6">Ready to Practice?</h2>

                                    <div className="mb-8">
                                        <label className="block text-sm font-medium mb-2 text-gray-300">Select Pose</label>
                                        <select
                                            value={currentPose}
                                            onChange={(e) => setCurrentPose(e.target.value)}
                                            className="px-6 py-3 rounded-lg text-black bg-white font-bold text-lg min-w-[200px]"
                                        >
                                            {Object.keys(POSE_CONFIG).map(key => (
                                                <option key={key} value={key}>{POSE_CONFIG[key].name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button onClick={startPractice} className="px-10 py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-bold text-xl transition-all hover:scale-105 shadow-lg shadow-accent/50">
                                        Start Session
                                    </button>
                                </div>
                            )}

                            <video ref={videoRef} className="hidden" playsInline style={{ width: '1280px', height: '720px' }} />
                            <canvas ref={canvasRef} width="1280" height="720" className={`w-full h-auto ${isPracticing ? 'block' : 'hidden'}`} />

                            {/* Overlay Controls */}
                            {isPracticing && (
                                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                    <div className="bg-black/50 p-4 rounded-xl text-white backdrop-blur-md">
                                        <p className="text-sm opacity-75">Time</p>
                                        <p className="text-2xl font-mono font-bold">{formatTime(duration)}</p>
                                    </div>
                                    <button onClick={stopPractice} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold shadow-lg">
                                        End Session
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3 flex flex-col gap-6">
                        {/* Info Card */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="text-xl font-bold text-earth-900">{POSE_CONFIG[currentPose].name}</h3>
                            <p className="text-gray-600 mt-2">{POSE_CONFIG[currentPose].description}</p>
                        </div>

                        {/* Real-time Feedback */}
                        <div className={`p-6 rounded-xl shadow-md transition-colors duration-300 ${score >= 90 ? 'bg-green-50 border-2 border-green-200' :
                            score >= 70 ? 'bg-yellow-50 border-2 border-yellow-200' :
                                'bg-red-50 border-2 border-red-200'
                            }`}>
                            <h3 className="text-lg font-bold mb-2 flex justify-between">
                                Accuracy
                                <span className="text-2xl">{score}%</span>
                            </h3>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                <div className={`h-2 rounded-full transition-all duration-300 ${score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} style={{ width: `${score}%` }}></div>
                            </div>
                            <p className="font-medium text-lg min-h-[3rem]">{feedback}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIPracticeStudio;
