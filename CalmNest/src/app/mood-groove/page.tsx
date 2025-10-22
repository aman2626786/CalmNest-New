import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import { useSession } from '@supabase/auth-helpers-react';
import './styles.css';

declare const faceapi: any;

// Guidance data copied from index.html
const emotionalGuidance = {
  happy: {
    icon: '😊',
    title: 'You seem happy!',
    message: 'Great to see you in a positive mood!',
    tips: [
      'Share your happiness with others - it\'s contagious!',
      'Use this positive energy to tackle challenging tasks',
      'Take a moment to appreciate what\'s making you happy'
    ],
  },
  sad: {
    icon: '🙁',
    title: 'You seem sad',
    message: 'It\'s okay to feel down sometimes. Here are some suggestions:',
    tips: [
      'Talk to someone you trust about how you\'re feeling',
      'Engage in activities you usually enjoy, even if you don\'t feel like it',
      'Practice self-care - take a warm bath, listen to music, or go for a walk',
    ],
  },
  angry: {
    icon: '😠',
    title: 'You seem angry',
    message: 'Anger is a natural emotion. Here are healthy ways to manage it:',
    tips: [
      'Take deep breaths - inhale for 4 seconds, hold for 4, exhale for 6',
      'Step away from the situation temporarily if possible',
      'Channel the energy into physical activity like walking or exercise'
    ],
  },
  fearful: {
    icon: '😨',
    title: 'You seem anxious or fearful',
    message: 'It\'s natural to feel anxious sometimes. Try these techniques:',
    tips: [
      'Practice grounding techniques - name 5 things you can see, 4 you can touch, 3 you can hear...', 
      'Focus on your breathing - slow, deep breaths can calm your nervous system',
      'Challenge negative thoughts by asking "What\'s the evidence for this fear?"',
    ],
  },
  disgusted: {
    icon: '🤢',
    title: 'You seem disgusted',
    message: 'Disgust is a protective emotion. Consider what is triggering this feeling and if you can address it.',
    tips: []
  },
  surprised: {
    icon: '😮',
    title: 'You seem surprised',
    message: 'Take a moment to process the new information before reacting.',
    tips: []
  },
  neutral: {
    icon: '😐',
    title: 'You seem neutral',
    message: 'A balanced emotional state is great for making thoughtful decisions or focusing on tasks.',
    tips: []
  },
};

const expressionColors: { [key: string]: string } = {
  neutral: '#60a5fa',
  happy: '#4ade80',
  sad: '#60a5fa',
  angry: '#f87171',
  fearful: '#fbbf24',
  disgusted: '#a78bfa',
  surprised: '#fbbf24',
};

const MoodGroovePage = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [dominantMood, setDominantMood] = useState<string | null>(null);
  const [expressions, setExpressions] = useState<any>({});
  const [mentalHealth, setMentalHealth] = useState({ depression: 0, anxiety: 0 });
  const [faceCount, setFaceCount] = useState(0);
  const [guidance, setGuidance] = useState<any>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [sessionData, setSessionData] = useState<any[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const session = useSession();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
        setCameraActive(true);
        setSessionStartTime(new Date());
        setSessionData([]);
        detectionIntervalRef.current = setInterval(detectExpressions, 2000);
      };
    } catch (err) {
      console.error("Camera error:", err);
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
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    
    // Save session data when camera stops
    if (sessionData.length > 0) {
      saveSessionData();
    }
    
    setDominantMood(null);
    setExpressions({});
    setFaceCount(0);
    setGuidance(null);
    setSessionData([]);
    setSessionStartTime(null);
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
        const sortedExpressions = Object.entries(mainDetection.expressions).sort((a, b) => (b[1] as number) - (a[1] as number));
        const topExpression = sortedExpressions[0][0] as keyof typeof emotionalGuidance;
        
        setDominantMood(topExpression);
        setExpressions(mainDetection.expressions);
        setFaceCount(resizedDetections.length);
        setGuidance(emotionalGuidance[topExpression] || null);
        setConfidence(mainDetection.expressions[topExpression] || 0);

        const depScore = (mainDetection.expressions.sad || 0) * 100;
        const anxScore = (mainDetection.expressions.fearful || 0) * 100;
        const newMentalHealth = { depression: depScore, anxiety: anxScore };
        setMentalHealth(newMentalHealth);
        
        // Collect session data for analysis
        if (topExpression && mainDetection.expressions[topExpression] > 0.3) {
          const sessionEntry = {
            timestamp: new Date(),
            dominantMood: topExpression,
            confidence: mainDetection.expressions[topExpression],
            depression: newMentalHealth.depression,
            anxiety: newMentalHealth.anxiety,
            expressions: mainDetection.expressions
          };
          setSessionData(prev => [...prev, sessionEntry]);
        }
      }
    } else {
      setDominantMood(null);
      setExpressions({});
      setFaceCount(0);
      setGuidance(null);
    }
  };

  const saveSessionData = async () => {
    if (!session?.user?.id) {
      alert('You must be logged in to save your session.');
      return;
    }

    if (sessionData.length === 0) {
      console.log("No session data to save");
      return;
    }

    try {
      const totalDetections = sessionData.length;
      const moodCounts = sessionData.reduce((acc, entry) => {
        acc[entry.dominantMood] = (acc[entry.dominantMood] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const avgDepression = sessionData.reduce((sum, entry) => sum + entry.depression, 0) / totalDetections;
      const avgAnxiety = sessionData.reduce((sum, entry) => sum + entry.anxiety, 0) / totalDetections;
      const avgConfidence = sessionData.reduce((sum, entry) => sum + entry.confidence, 0) / totalDetections;

      const dominantMood = Object.entries(moodCounts).reduce((a, b) => moodCounts[a[0]] > moodCounts[b[0]] ? a : b)[0];

      const moodGrooveResult = {
        userId: session.user.id,
        userEmail: session.user.email,
        dominantMood: dominantMood,
        confidence: avgConfidence,
        depression: avgDepression,
        anxiety: avgAnxiety,
        expressions: expressions,
      };

      const response = await fetch('http://127.0.0.1:5001/api/mood-groove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moodGrooveResult),
      });

      if (response.ok) {
        console.log("Mood groove session saved successfully");
        alert(`Analysis completed! Detected ${totalDetections} expressions. Dominant mood: ${dominantMood}`);
      } else {
        console.error("Failed to save mood groove session:", await response.text());
      }
    } catch (error) {
      console.error("Error saving mood groove data:", error);
    }
  };


  return (
    <>
      <Script
        src="https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js"
        onLoad={() => loadModels()}
      />
      <div className="wrap">
        <div className="card">
          <div className="mood-groove-title">Mood Groove - Live Emotion Detection</div>
          <div id="videoWrap">
            <video ref={videoRef} id="inputVideo" autoPlay muted playsInline></video>
            <canvas ref={canvasRef} id="overlay" />
          </div>
          <div className="controls">
            <button onClick={startCamera} disabled={!modelsLoaded || cameraActive}>
              {modelsLoaded ? 'Start Camera' : 'Loading Models...'}
            </button>
            <button onClick={stopCamera} disabled={!cameraActive}>Stop Camera</button>
          </div>
        </div>

        <div className="stats card">
          <div className="statCard">
            <div className="dominant">Detected mood: <span>{dominantMood || '—'}</span></div>
            <div className="muted">Faces: {faceCount}</div>
          </div>

          {dominantMood && (
            <>
              <div className="statCard">
                <strong>Expressions</strong>
                <div className="expressionsList">
                  {Object.entries(expressions).sort((a,b) => b[1] - a[1]).map(([expr, value]) => (
                    <div className="expr" key={expr}>
                      <div className="expr-header">
                        <div>{expr}</div>
                        <div>{((value as number) * 100).toFixed(1)}%</div>
                      </div>
                      <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${value * 100}%`, backgroundColor: expressionColors[expr] || '#60a5fa' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="statCard">
                <strong>Mental Health Indicators</strong>
                <div className="expr">
                    <div className="expr-header">
                        <div>Depression Signs</div>
                        <div>{mentalHealth.depression.toFixed(1)}%</div>
                    </div>
                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${mentalHealth.depression}%`, background: 'var(--depression)' }}></div>
                    </div>
                </div>
                <div className="expr">
                    <div className="expr-header">
                        <div>Anxiety Signs</div>
                        <div>{mentalHealth.anxiety.toFixed(1)}%</div>
                    </div>
                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${mentalHealth.anxiety}%`, background: 'var(--anxiety)' }}></div>
                    </div>
                </div>
              </div>

              {guidance && (
                <div className="guidance-card">
                  <div className="guidance-title">
                    <span>{guidance.icon}</span>
                    <span>{guidance.title}</span>
                  </div>
                  <div className="guidance-content">
                    {guidance.message}
                    {guidance.tips && guidance.tips.length > 0 && (
                        <div className="guidance-tip">
                            {guidance.tips.map((tip: string, i: number) => <div key={i}>• {tip}</div>)}
                        </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
