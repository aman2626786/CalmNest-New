'use client';

import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import { useSession } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  CameraOff, 
  BarChart3, 
  BookOpen, 
  Heart, 
  Brain, 
  Activity,
  TrendingUp,
  Calendar,
  Lightbulb,
  Music,
  Headphones,
  Wind,
  Coffee,
  Smile,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { FAQ } from '@/components/common/FAQ';
import './styles.css';

declare const faceapi: any;

// Enhanced emotional guidance with activities and resources
const emotionalGuidance = {
  happy: {
    icon: '😊',
    title: 'You seem happy!',
    message: 'Great to see you in a positive mood!',
    color: '#4ade80',
    tips: [
      'Share your happiness with others - it\'s contagious!',
      'Use this positive energy to tackle challenging tasks',
      'Take a moment to appreciate what\'s making you happy'
    ],
    activities: [
      { icon: <Heart className="w-4 h-4" />, title: 'Practice Gratitude', description: 'Write down 3 things you\'re grateful for' },
      { icon: <Music className="w-4 h-4" />, title: 'Share Joy', description: 'Call a friend or family member' },
      { icon: <TrendingUp className="w-4 h-4" />, title: 'Set Goals', description: 'Use this positive energy to plan ahead' }
    ]
  },
  sad: {
    icon: '🙁',
    title: 'You seem sad',
    message: 'It\'s okay to feel down sometimes. Here are some suggestions:',
    color: '#60a5fa',
    tips: [
      'Talk to someone you trust about how you\'re feeling',
      'Engage in activities you usually enjoy, even if you don\'t feel like it',
      'Practice self-care - take a warm bath, listen to music, or go for a walk',
    ],
    activities: [
      { icon: <BookOpen className="w-4 h-4" />, title: 'Journal Writing', description: 'Express your feelings on paper' },
      { icon: <Headphones className="w-4 h-4" />, title: 'Calming Music', description: 'Listen to soothing melodies' },
      { icon: <Coffee className="w-4 h-4" />, title: 'Self-Care', description: 'Take a warm bath or make tea' }
    ]
  },
  angry: {
    icon: '😠',
    title: 'You seem angry',
    message: 'Anger is a natural emotion. Here are healthy ways to manage it:',
    color: '#f87171',
    tips: [
      'Take deep breaths - inhale for 4 seconds, hold for 4, exhale for 6',
      'Step away from the situation temporarily if possible',
      'Channel the energy into physical activity like walking or exercise'
    ],
    activities: [
      { icon: <Wind className="w-4 h-4" />, title: 'Breathing Exercise', description: '4-7-8 breathing technique' },
      { icon: <Activity className="w-4 h-4" />, title: 'Physical Activity', description: 'Go for a walk or do jumping jacks' },
      { icon: <Brain className="w-4 h-4" />, title: 'Mindfulness', description: 'Practice the 5-4-3-2-1 grounding technique' }
    ]
  },
  fearful: {
    icon: '😨',
    title: 'You seem anxious or fearful',
    message: 'It\'s natural to feel anxious sometimes. Try these techniques:',
    color: '#fbbf24',
    tips: [
      'Practice grounding techniques - name 5 things you can see, 4 you can touch, 3 you can hear...', 
      'Focus on your breathing - slow, deep breaths can calm your nervous system',
      'Challenge negative thoughts by asking "What\'s the evidence for this fear?"',
    ],
    activities: [
      { icon: <Wind className="w-4 h-4" />, title: 'Box Breathing', description: 'Inhale 4, hold 4, exhale 4, hold 4' },
      { icon: <Brain className="w-4 h-4" />, title: 'Grounding 5-4-3-2-1', description: 'Name 5 things you see, 4 you touch...' },
      { icon: <Headphones className="w-4 h-4" />, title: 'Guided Meditation', description: '5-minute anxiety relief meditation' }
    ]
  },
  disgusted: {
    icon: '🤢',
    title: 'You seem disgusted',
    message: 'Disgust is a protective emotion. Consider what is triggering this feeling.',
    color: '#a78bfa',
    tips: ['Identify the source of disgust', 'Remove yourself from the trigger if possible'],
    activities: [
      { icon: <Wind className="w-4 h-4" />, title: 'Fresh Air', description: 'Step outside for fresh air' },
      { icon: <Brain className="w-4 h-4" />, title: 'Mindful Reset', description: 'Take 5 deep breaths to reset' }
    ]
  },
  surprised: {
    icon: '😮',
    title: 'You seem surprised',
    message: 'Take a moment to process the new information before reacting.',
    color: '#fbbf24',
    tips: ['Pause and breathe', 'Process the information slowly'],
    activities: [
      { icon: <Clock className="w-4 h-4" />, title: 'Pause & Reflect', description: 'Take 30 seconds to process' },
      { icon: <Brain className="w-4 h-4" />, title: 'Mindful Awareness', description: 'Notice your body\'s response' }
    ]
  },
  neutral: {
    icon: '😐',
    title: 'You seem neutral',
    message: 'A balanced emotional state is great for making thoughtful decisions.',
    color: '#60a5fa',
    tips: ['Use this clarity for important decisions', 'Focus on productive tasks'],
    activities: [
      { icon: <TrendingUp className="w-4 h-4" />, title: 'Goal Setting', description: 'Plan your next steps' },
      { icon: <BookOpen className="w-4 h-4" />, title: 'Learning', description: 'Read or learn something new' }
    ]
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
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<any>({});
  const [currentActivity, setCurrentActivity] = useState<any>(null);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('detection');
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

  const fetchMoodHistory = async () => {
    if (!session?.user?.id) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/mood-groove/history/${session.user.id}`);
      if (response.ok) {
        const history = await response.json();
        setMoodHistory(history);
        calculateWeeklyStats(history);
      }
    } catch (error) {
      console.error("Error fetching mood history:", error);
    }
  };

  const calculateWeeklyStats = (history: any[]) => {
    const last7Days = history.filter(entry => {
      const entryDate = new Date(entry.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    const moodCounts = last7Days.reduce((acc, entry) => {
      acc[entry.dominant_mood] = (acc[entry.dominant_mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgDepression = last7Days.length > 0 
      ? last7Days.reduce((sum, entry) => sum + entry.depression, 0) / last7Days.length 
      : 0;
    
    const avgAnxiety = last7Days.length > 0 
      ? last7Days.reduce((sum, entry) => sum + entry.anxiety, 0) / last7Days.length 
      : 0;

    setWeeklyStats({
      totalSessions: last7Days.length,
      moodCounts,
      avgDepression,
      avgAnxiety,
      mostCommonMood: Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral'
    });
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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/mood-groove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moodGrooveResult),
      });

      if (response.ok) {
        console.log("Mood groove session saved successfully");
        alert(`Analysis completed! Detected ${totalDetections} expressions. Dominant mood: ${dominantMood}`);
        fetchMoodHistory(); // Refresh history after saving
      } else {
        console.error("Failed to save mood groove session:", await response.text());
      }
    } catch (error) {
      console.error("Error saving mood groove data:", error);
    }
  };

  const completeActivity = (activityTitle: string) => {
    setCompletedActivities(prev => [...prev, activityTitle]);
    setCurrentActivity(null);
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchMoodHistory();
    }
  }, [session?.user?.id]);

  const moodGrooveFAQs = [
    {
      question: "How accurate is the emotion detection?",
      answer: "Our AI-powered emotion detection uses advanced facial recognition technology with an average accuracy of 85-90%. The accuracy improves with better lighting and clear facial visibility."
    },
    {
      question: "Is my facial data stored or shared?",
      answer: "No, your facial data is processed locally in your browser and is not stored or transmitted. Only the emotion analysis results are saved to track your mood patterns."
    },
    {
      question: "How often should I use Mood Groove?",
      answer: "For best results, we recommend using Mood Groove 2-3 times per week or whenever you want to check in with your emotional state. Regular use helps build better self-awareness."
    },
    {
      question: "What should I do if the camera doesn't work?",
      answer: "Make sure you've granted camera permissions to your browser. Check that no other applications are using your camera, and ensure you have good lighting for better detection."
    },
    {
      question: "Can I use this on my phone?",
      answer: "Yes! Mood Groove works on mobile devices. For best results, hold your phone steady and ensure your face is well-lit and clearly visible to the front camera."
    },
    {
      question: "How do the wellness activities help?",
      answer: "The activities are scientifically-backed techniques tailored to your detected mood. They provide immediate coping strategies and long-term emotional regulation skills."
    }
  ];


  return (
    <>
      <Script
        src="https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js"
        onLoad={() => loadModels()}
      />
      <div className="min-h-screen bg-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              Mood Groove
            </h1>
            <p className="text-gray-300 text-lg">
              AI-powered emotion detection with personalized wellness recommendations
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-700 border border-gray-600 mb-6 p-1 rounded-lg">
              <TabsTrigger 
                value="detection" 
                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-600 data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all duration-200"
              >
                <Camera className="w-4 h-4" />
                Live Detection
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-600 data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="activities" 
                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-600 data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all duration-200"
              >
                <Lightbulb className="w-4 h-4" />
                Activities
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-gray-600 data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all duration-200"
              >
                <Calendar className="w-4 h-4" />
                History
              </TabsTrigger>
            </TabsList>

            {/* Live Detection Tab */}
            <TabsContent value="detection" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Camera Section */}
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Live Camera Feed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
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
                      {!cameraActive && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                          <div className="text-center">
                            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400">Camera not active</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={startCamera} 
                        disabled={!modelsLoaded || cameraActive}
                        className="flex-1"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {modelsLoaded ? 'Start Detection' : 'Loading Models...'}
                      </Button>
                      <Button 
                        onClick={stopCamera} 
                        disabled={!cameraActive}
                        variant="outline"
                        className="flex-1"
                      >
                        <CameraOff className="w-4 h-4 mr-2" />
                        Stop Detection
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Real-time Results */}
                <div className="space-y-4">
                  {/* Current Mood */}
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Smile className="w-5 h-5" />
                        Current Mood
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dominantMood ? (
                        <div className="text-center">
                          <div className="text-6xl mb-4">{guidance?.icon}</div>
                          <h3 className="text-2xl font-bold text-white mb-2">{guidance?.title}</h3>
                          <Badge 
                            className="mb-4" 
                            style={{ backgroundColor: guidance?.color + '20', color: guidance?.color }}
                          >
                            {(confidence * 100).toFixed(1)}% confidence
                          </Badge>
                          <p className="text-gray-300">{guidance?.message}</p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 py-8">
                          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                          <p>No face detected. Position yourself in front of the camera.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Expression Breakdown */}
                  {dominantMood && (
                    <Card className="bg-gray-700 border-gray-600">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Expression Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Object.entries(expressions)
                          .sort((a, b) => (b[1] as number) - (a[1] as number))
                          .map(([expr, value]) => (
                            <div key={expr} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="capitalize">{expr}</span>
                                <span>{((value as number) * 100).toFixed(1)}%</span>
                              </div>
                              <Progress 
                                value={(value as number) * 100} 
                                className="h-2"
                              />
                            </div>
                          ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Mental Health Indicators */}
                  {dominantMood && (
                    <Card className="bg-gray-700 border-gray-600">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="w-5 h-5" />
                          Wellness Indicators
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Stress Level</span>
                            <span>{mentalHealth.anxiety.toFixed(1)}%</span>
                          </div>
                          <Progress value={mentalHealth.anxiety} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Low Mood Signs</span>
                            <span>{mentalHealth.depression.toFixed(1)}%</span>
                          </div>
                          <Progress value={mentalHealth.depression} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Calendar className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">This Week</p>
                        <p className="text-2xl font-bold">{weeklyStats.totalSessions || 0}</p>
                        <p className="text-xs text-gray-500">Sessions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <Smile className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Most Common</p>
                        <p className="text-2xl font-bold capitalize">{weeklyStats.mostCommonMood || 'N/A'}</p>
                        <p className="text-xs text-gray-500">Mood</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-yellow-500/20 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Avg Stress</p>
                        <p className="text-2xl font-bold">{(weeklyStats.avgAnxiety || 0).toFixed(1)}%</p>
                        <p className="text-xs text-gray-500">This Week</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <Heart className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Wellness</p>
                        <p className="text-2xl font-bold">
                          {weeklyStats.avgAnxiety < 30 ? 'Good' : weeklyStats.avgAnxiety < 60 ? 'Fair' : 'Needs Attention'}
                        </p>
                        <p className="text-xs text-gray-500">Overall</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mood Distribution */}
              {weeklyStats.moodCounts && Object.keys(weeklyStats.moodCounts).length > 0 && (
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle>Weekly Mood Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(weeklyStats.moodCounts).map(([mood, count]) => (
                        <div key={mood} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="capitalize flex items-center gap-2">
                              <span>{emotionalGuidance[mood as keyof typeof emotionalGuidance]?.icon}</span>
                              {mood}
                            </span>
                            <span>{count} sessions</span>
                          </div>
                          <Progress 
                            value={(count as number / weeklyStats.totalSessions) * 100} 
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-6">
              {guidance?.activities ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {guidance.activities.map((activity: any, index: number) => (
                    <Card key={index} className="bg-gray-700 border-gray-600 hover:bg-gray-650 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-purple-500/20 rounded-lg">
                            {activity.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{activity.title}</h3>
                            <p className="text-sm text-gray-400 mb-4">{activity.description}</p>
                            <Button 
                              size="sm" 
                              onClick={() => completeActivity(activity.title)}
                              disabled={completedActivities.includes(activity.title)}
                              className="w-full"
                            >
                              {completedActivities.includes(activity.title) ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Completed
                                </>
                              ) : (
                                'Start Activity'
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-12 text-center">
                    <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Activities Available</h3>
                    <p className="text-gray-400">Start a mood detection session to get personalized activity recommendations.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              {moodHistory.length > 0 ? (
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle>Recent Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {moodHistory.slice(0, 10).map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">
                              {emotionalGuidance[entry.dominant_mood as keyof typeof emotionalGuidance]?.icon}
                            </span>
                            <div>
                              <p className="font-medium capitalize">{entry.dominant_mood}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(entry.created_at).toLocaleDateString()} at{' '}
                                {new Date(entry.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Confidence</p>
                            <p className="font-medium">{(entry.confidence * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-700 border-gray-600">
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No History Yet</h3>
                    <p className="text-gray-400">Complete some mood detection sessions to see your history here.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* FAQ Section */}
          <FAQ 
            title="Mood Groove FAQ"
            faqs={moodGrooveFAQs}
            className="mt-12"
          />
        </div>
      </div>
    </>
  );
};

export default MoodGroovePage;
