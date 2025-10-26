'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Brain, 
  Heart, 
  Camera, 
  CheckCircle, 
  Clock, 
  Shield, 
  ArrowRight,
  AlertCircle,
  Users,
  BarChart3
} from 'lucide-react';

export default function ComprehensiveAssessmentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to login if not authenticated (but be more lenient)
  useEffect(() => {
    if (!loading && !user) {
      // Check if there's a stored email as backup
      const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
      if (!storedEmail) {
        router.push('/login?redirectTo=' + encodeURIComponent('/comprehensive-assessment'));
      }
    }
  }, [user, loading, router]);

  const handleStartAssessment = async () => {
    // Check for user or stored email
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
    if (!user?.id && !storedEmail) {
      router.push('/login?redirectTo=' + encodeURIComponent('/comprehensive-assessment'));
      return;
    }

    setIsLoading(true);
    
    try {
      const userId = user?.id || storedEmail || 'temp_user';
      console.log('Starting assessment for user:', userId);
      
      // Generate a temporary session ID for now
      const sessionId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Generated session ID:', sessionId);
      
      // Navigate to assessment flow with temporary session ID
      router.push(`/comprehensive-assessment/${sessionId}`);
    } catch (error) {
      console.error('Error starting assessment:', error);
      alert(`Error starting assessment: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Comprehensive Mental Health Assessment
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get a complete picture of your mental wellness through our integrated assessment combining 
            validated clinical tools with AI-powered analysis.
          </p>
        </motion.div>

        {/* Assessment Overview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700 h-full">
              <CardHeader className="text-center">
                <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <CardTitle className="text-white">PHQ-9 & GAD-7</CardTitle>
                <CardDescription>Clinical depression and anxiety screening</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gray-800 border-gray-700 h-full">
              <CardHeader className="text-center">
                <Camera className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <CardTitle className="text-white">Mood Grove AI</CardTitle>
                <CardDescription>Facial emotion analysis and mood detection</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gray-800 border-gray-700 h-full">
              <CardHeader className="text-center">
                <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <CardTitle className="text-white">Wellness Factors</CardTitle>
                <CardDescription>Resilience, stress, sleep & social support</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gray-800 border-gray-700 h-full">
              <CardHeader className="text-center">
                <BarChart3 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <CardTitle className="text-white">AI Analysis</CardTitle>
                <CardDescription>Personalized insights and recommendations</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        {/* Main Assessment Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                What You'll Get
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Assessment Includes:</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      PHQ-9 Depression Screening (9 questions)
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      GAD-7 Anxiety Assessment (7 questions)
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      AI-Powered Facial Emotion Analysis
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      Resilience & Stress Assessment
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      Sleep Quality & Social Support Evaluation
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">You'll Receive:</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      Comprehensive Mental Health Report
                    </li>
                    <li className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      Personalized AI Analysis Prompt
                    </li>
                    <li className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      Tailored Wellness Recommendations
                    </li>
                    <li className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      Chatbot Guidance Integration
                    </li>
                    <li className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      Complete Privacy & Confidentiality
                    </li>
                  </ul>
                </div>
              </div>

              {/* Assessment Info */}
              <div className="bg-gray-700/50 rounded-lg p-6 mt-8">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center">
                    <Clock className="w-8 h-8 text-blue-400 mb-2" />
                    <div className="text-2xl font-bold text-white">15-20</div>
                    <div className="text-sm text-gray-400">Minutes</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <CheckCircle className="w-8 h-8 text-emerald-400 mb-2" />
                    <div className="text-2xl font-bold text-white">6</div>
                    <div className="text-sm text-gray-400">Assessment Steps</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Shield className="w-8 h-8 text-purple-400 mb-2" />
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-sm text-gray-400">Confidential</div>
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-1">Privacy & Security</h4>
                    <p className="text-sm text-blue-200">
                      Your assessment data is encrypted and stored securely. Only you can access your results. 
                      We never share your personal mental health information with third parties.
                    </p>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center pt-6">
                <Button 
                  onClick={handleStartAssessment}
                  disabled={isLoading}
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Starting Assessment...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Activity className="w-6 h-6" />
                      Start Comprehensive Assessment
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                </Button>
                <p className="text-sm text-gray-400 mt-3">
                  Assessment progress is automatically saved. You can pause and resume anytime.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-amber-900/20 border-amber-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-300 mb-2">Important Notice</h4>
                  <p className="text-amber-200 text-sm leading-relaxed">
                    This assessment is for informational purposes and self-awareness. It is not a substitute for 
                    professional medical diagnosis or treatment. If you're experiencing severe symptoms or having 
                    thoughts of self-harm, please contact a mental health professional or crisis helpline immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}