'use client';

import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, CameraOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

declare const faceapi: any;

interface MoodGroveComponentProps {
  onComplete: (data: { 
    dominantMood: string; 
    confidence: number; 
    depression: number; 
    anxiety: number; 
    expressions: any 
  }) => void;
  onNext: () => void;
}

const emotionalGuidance = {
  happy: { icon: '😊', title: 'Happy', color: '#4ade80' },
  sad: { icon: '🙁', title: 'Sad', color: '#60a5fa' },
  angry: { icon: '😠', title: 'Angry', color: '#f87171' },
  fearful: { icon: '😨', title: 'Anxious', color: '#fbbf24' },
  disgusted: { icon: '🤢', title: 'Disgusted', color: '#a78bfa' },
  surprised: { icon: '😮', title: 'Surprised', color: '#fbbf24' },
  neutral: { icon: '😐', title: 'Neutral', color: '#60a5fa' },
};

export default function MoodGroveComponent({ onComplete, onNext }: MoodGroveComponentProps) {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [dominantMood, setDominantMood] = useState<string | null>(null);
  const [expressions, setExpressions] = useState<any>({});
  const [confidence, setConfidence] = useState<number>(0);
  const [sessionData, setSessionData] = useState<any[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loadModels = async () => {
    const modelPath = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
        faceapi.nets.faceExpressionNet.loadFromUri(modelPath),
      ]);
      setModelsLoaded(true);
    } catch (err) {
      console.error("Model load failed", err);
    }
  };

  const startCamera = async () => {
    if (cameraActive || !videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
        setCameraActive(true);
        setSessionStartTime(new Date());
        setSessionData([]);
        setTimeRemaining(120);
        
        // Start detection and timer
        detectionIntervalRef.current = setInterval(detectExpressions, 2000);
        timerRef.current = setInterval(() => {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              completeSession();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      };
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera access denied. Please allow camera access and try again.");
    }
  };

  const stopCamera = () => {
    if (!cameraActive || !videoRef.current) return;
    const stream = videoRef.current.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setCameraActive(false);
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const detectExpressions = async () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.paused || videoRef.current.ended) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.clientWidth, height: video.clientHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()
      .withFaceExpressions();

    const context = canvas.getContext('2d');
    context?.clearRect(0, 0, canvas.width, canvas.height);
    
    if (detections && detections.length > 0) {
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      const mainDetection = resizedDetections[0];
      if (mainDetection && mainDetection.expressions) {
        const sortedExpressions = Object.entries(mainDetection.expressions)
          .sort((a, b) => (b[1] as number) - (a[1] as number));
        const topExpression = sortedExpressions[0][0] as keyof typeof emotionalGuidance;
        
        setDominantMood(topExpression);
        setExpressions(mainDetection.expressions);
        setConfidence(mainDetection.expressions[topExpression] || 0);

        // Collect session data
        if (topExpression && mainDetection.expressions[topExpression] > 0.3) {
          const sessionEntry = {
            timestamp: new Date(),
            dominantMood: topExpression,
            confidence: mainDetection.expressions[topExpression],
            depression: (mainDetection.expressions.sad || 0) * 100,
            anxiety: (mainDetection.expressions.fearful || 0) * 100,
            expressions: mainDetection.expressions
          };
          setSessionData(prev => [...prev, sessionEntry]);
        }
      }
    } else {
      setDominantMood(null);
      setExpressions({});
      setConfidence(0);
    }
  };

  const completeSession = async () => {
    stopCamera();
    setIsCompleted(true);
    setIsSubmitting(true);

    if (sessionData.length === 0) {
      alert("No facial expressions detected. Please try again with better lighting.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Calculate averages
      const totalDetections = sessionData.length;
      const moodCounts = sessionData.reduce((acc, entry) => {
        acc[entry.dominantMood] = (acc[entry.dominantMood] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const avgDepression = sessionData.reduce((sum, entry) => sum + entry.depression, 0) / totalDetections;
      const avgAnxiety = sessionData.reduce((sum, entry) => sum + entry.anxiety, 0) / totalDetections;
      const avgConfidence = sessionData.reduce((sum, entry) => sum + entry.confidence, 0) / totalDetections;

      const dominantMoodResult = Object.entries(moodCounts)
        .reduce((a, b) => moodCounts[a[0]] > moodCounts[b[0]] ? a : b)[0];

      const result = {
        dominantMood: dominantMoodResult,
        confidence: avgConfidence,
        depression: avgDepression,
        anxiety: avgAnxiety,
        expressions: expressions
      };

      // Call completion handler
      onComplete(result);
      
      setTimeout(() => {
        onNext();
      }, 2000);

    } catch (error) {
      console.error('Error processing mood analysis:', error);
      alert('Error processing results. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Script
        src="https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js"
        onLoad={() => loadModels()}
      />
      
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Camera className="w-6 h-6 text-yellow-400" />
              AI-Powered Mood Analysis
            </CardTitle>
            <CardDescription>
              We'll analyze your facial expressions for 2 minutes to understand your current emotional state.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Camera Section */}
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas 
                ref={canvasRef} 
                className="absolute inset-0 pointer-events-none"
              />
              
              {!cameraActive && !isCompleted && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Camera not active</p>
                    <Button 
                      onClick={startCamera} 
                      disabled={!modelsLoaded}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      {modelsLoaded ? (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          Start Analysis
                        </>
                      ) : (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading AI Models...
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {isCompleted && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold mb-2">Analysis Complete!</p>
                    <p className="text-gray-300">Processing your results...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Timer and Progress */}
            {cameraActive && !isCompleted && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Analysis Progress</span>
                  <span className="text-sm text-gray-400">{formatTime(timeRemaining)} remaining</span>
                </div>
                <Progress value={((120 - timeRemaining) / 120) * 100} className="h-2" />
              </div>
            )}

            {/* Real-time Results */}
            {cameraActive && dominantMood && !isCompleted && (
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-gray-700/50 border-gray-600">
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2">
                      {emotionalGuidance[dominantMood as keyof typeof emotionalGuidance]?.icon}
                    </div>
                    <h3 className="font-semibold text-white mb-1">
                      {emotionalGuidance[dominantMood as keyof typeof emotionalGuidance]?.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {(confidence * 100).toFixed(1)}% confidence
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-700/50 border-gray-600">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-white mb-3">Live Detection</h4>
                    <div className="space-y-2">
                      {Object.entries(expressions)
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .slice(0, 3)
                        .map(([expr, value]) => (
                          <div key={expr} className="flex justify-between text-sm">
                            <span className="capitalize text-gray-300">{expr}</span>
                            <span className="text-gray-400">{((value as number) * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Controls */}
            {cameraActive && !isCompleted && (
              <div className="flex gap-3">
                <Button 
                  onClick={completeSession}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Analysis Early
                </Button>
                <Button 
                  onClick={stopCamera}
                  variant="outline"
                  className="flex-1"
                >
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop Camera
                </Button>
              </div>
            )}

            {/* Instructions */}
            {!cameraActive && !isCompleted && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Instructions:</h4>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• Ensure good lighting on your face</li>
                  <li>• Look directly at the camera</li>
                  <li>• Keep your face visible for 2 minutes</li>
                  <li>• Try to maintain natural expressions</li>
                  <li>• The analysis will complete automatically</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}