'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Brain,
  Camera,
  Heart,
  BarChart3,
  Clock,
  Download,
  Copy,
  Loader2
} from 'lucide-react';
import PHQ9Component from '@/components/assessment/PHQ9Component';
import GAD7Component from '@/components/assessment/GAD7Component';
import MoodGroveComponent from '@/components/assessment/MoodGroveComponent';
import AdditionalAssessmentsComponent from '@/components/assessment/AdditionalAssessmentsComponent';
import { generateComprehensiveAnalysis } from '@/utils/analysisGenerator';

interface AssessmentData {
  assessment: {
    id: number;
    session_id: string;
    user_id: string;
    status: string;
    started_at: string;
    completed_at: string | null;
  };
  session: {
    current_step: string;
    session_data: any;
    last_activity: string | null;
  };
}

const steps = [
  { id: 'introduction', title: 'Introduction', icon: Activity, description: 'Welcome and overview' },
  { id: 'phq9', title: 'PHQ-9', icon: Brain, description: 'Depression screening' },
  { id: 'gad7', title: 'GAD-7', icon: Heart, description: 'Anxiety assessment' },
  { id: 'mood-groove', title: 'Mood Analysis', icon: Camera, description: 'Facial emotion detection' },
  { id: 'additional', title: 'Additional Tests', icon: BarChart3, description: 'Resilience, stress, sleep' },
  { id: 'results', title: 'Results', icon: CheckCircle, description: 'Your comprehensive report' }
];

export default function AssessmentSessionPage() {
  const params = useParams();
  const router = useRouter();
  const session = useSession();
  const sessionId = params.sessionId as string;
  
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [assessmentResults, setAssessmentResults] = useState<any>({});
  const [finalAnalysis, setFinalAnalysis] = useState<any>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/login?redirect=/comprehensive-assessment');
      return;
    }
    fetchAssessmentData();
  }, [session, sessionId]);

  const fetchAssessmentData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/comprehensive-assessment/${sessionId}`);
      
      if (response.ok) {
        const data = await response.json();
        setAssessmentData(data);
        
        const stepIndex = steps.findIndex(step => step.id === data.session.current_step);
        setCurrentStepIndex(stepIndex >= 0 ? stepIndex : 0);
      } else {
        console.error('Failed to fetch assessment data');
        alert('Failed to load assessment. Redirecting to start page.');
        router.push('/comprehensive-assessment');
      }
    } catch (error) {
      console.error('Error fetching assessment data:', error);
      alert('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const updateStep = async (newStep: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/comprehensive-assessment/${sessionId}/step`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_step: newStep,
          session_data: {
            ...assessmentData?.session.session_data,
            steps_completed: [...(assessmentData?.session.session_data?.steps_completed || []), steps[currentStepIndex].id]
          }
        }),
      });

      if (response.ok) {
        const newStepIndex = steps.findIndex(step => step.id === newStep);
        setCurrentStepIndex(newStepIndex);
        
        if (assessmentData) {
          setAssessmentData({
            ...assessmentData,
            session: { ...assessmentData.session, current_step: newStep }
          });
        }
      }
    } catch (error) {
      console.error('Error updating step:', error);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      updateStep(nextStep.id);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      updateStep(prevStep.id);
    }
  };

  const handleAssessmentComplete = (stepId: string, data: any) => {
    setAssessmentResults(prev => ({ ...prev, [stepId]: data }));
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    
    try {
      console.log('Assessment Results:', assessmentResults);
      
      // Generate comprehensive analysis
      const analysis = generateComprehensiveAnalysis(assessmentResults);
      console.log('Generated Analysis:', analysis);
      
      setFinalAnalysis(analysis);
      
      // Save results to database
      const savePromises = [];
      
      if (assessmentResults.phq9) {
        savePromises.push(
          fetch(`http://127.0.0.1:5001/api/comprehensive-assessment/${sessionId}/phq9`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assessmentResults.phq9),
          })
        );
      }
      
      if (assessmentResults.gad7) {
        savePromises.push(
          fetch(`http://127.0.0.1:5001/api/comprehensive-assessment/${sessionId}/gad7`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assessmentResults.gad7),
          })
        );
      }
      
      if (assessmentResults.moodGrove) {
        savePromises.push(
          fetch(`http://127.0.0.1:5001/api/comprehensive-assessment/${sessionId}/mood-groove`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assessmentResults.moodGrove),
          })
        );
      }
      
      if (assessmentResults.additional) {
        savePromises.push(
          fetch(`http://127.0.0.1:5001/api/comprehensive-assessment/${sessionId}/additional`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assessmentResults.additional),
          })
        );
      }
      
      await Promise.all(savePromises);
      
      const response = await fetch(`http://127.0.0.1:5001/api/comprehensive-assessment/${sessionId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysis),
      });

      if (response.ok) {
        setCurrentStepIndex(steps.length - 1);
        updateStep('results');
      } else {
        throw new Error('Failed to complete assessment');
      }
    } catch (error) {
      console.error('Error completing assessment:', error);
      alert('Error completing assessment. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const copyAnalysisPrompt = () => {
    if (finalAnalysis?.analysis_prompt) {
      navigator.clipboard.writeText(finalAnalysis.analysis_prompt);
      alert('✅ Analysis prompt copied to clipboard! You can now paste it in the chatbot for personalized guidance.');
    }
  };

  const downloadAnalysis = () => {
    if (finalAnalysis?.analysis_prompt) {
      const blob = new Blob([finalAnalysis.analysis_prompt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mental-health-analysis-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">Assessment not found</p>
          <Button onClick={() => router.push('/comprehensive-assessment')} className="mt-4">
            Start New Assessment
          </Button>
        </div>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Comprehensive Assessment</h1>
          <p className="text-gray-400">Session ID: {sessionId}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-gray-400">{currentStepIndex + 1} of {steps.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div
                key={step.id}
                className={`p-3 rounded-lg text-center transition-all ${
                  isCompleted ? 'bg-emerald-500/20 text-emerald-300' :
                  isCurrent ? 'bg-purple-500/20 text-purple-300' :
                  'bg-gray-700/50 text-gray-500'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-1" />
                <div className="text-xs font-medium">{step.title}</div>
              </div>
            );
          })}
        </div>

        {/* Current Step Content */}
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <currentStep.icon className="w-6 h-6 text-emerald-400" />
                {currentStep.title}
              </CardTitle>
              <CardDescription>{currentStep.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step-specific content */}
              {currentStep.id === 'introduction' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Welcome to Your Comprehensive Assessment</h3>
                  <p className="text-gray-300">
                    This assessment will take approximately 15-20 minutes and includes multiple validated tools 
                    to provide you with a complete picture of your mental wellness.
                  </p>
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">What to Expect:</h4>
                    <ul className="text-sm text-blue-200 space-y-1">
                      <li>• PHQ-9 Depression Screening (9 questions)</li>
                      <li>• GAD-7 Anxiety Assessment (7 questions)</li>
                      <li>• AI-Powered Mood Analysis (2-3 minutes)</li>
                      <li>• Additional wellness assessments (16 questions)</li>
                      <li>• Personalized analysis and recommendations</li>
                    </ul>
                  </div>
                </div>
              )}

              {currentStep.id === 'phq9' && (
                <PHQ9Component 
                  onComplete={(data) => handleAssessmentComplete('phq9', data)}
                  onNext={handleNext}
                />
              )}

              {currentStep.id === 'gad7' && (
                <GAD7Component 
                  onComplete={(data) => handleAssessmentComplete('gad7', data)}
                  onNext={handleNext}
                />
              )}

              {currentStep.id === 'mood-groove' && (
                <MoodGroveComponent 
                  onComplete={(data) => handleAssessmentComplete('moodGrove', data)}
                  onNext={handleNext}
                />
              )}

              {currentStep.id === 'additional' && (
                <AdditionalAssessmentsComponent 
                  onComplete={(data) => {
                    handleAssessmentComplete('additional', data);
                    setTimeout(() => handleComplete(), 1000);
                  }}
                  onNext={() => {}}
                />
              )}

              {currentStep.id === 'results' && (
                <div className="space-y-6">
                  {/* Loading State */}
                  {isCompleting && (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Generating Your Analysis</h3>
                      <p className="text-gray-300">Processing your comprehensive results...</p>
                    </div>
                  )}

                  {/* Results Display */}
                  {!isCompleting && finalAnalysis && (
                    <>
                      <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">Assessment Complete!</h3>
                        <p className="text-gray-300">Your comprehensive mental health analysis is ready.</p>
                      </div>

                      {/* Results Summary */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <Card className="bg-gray-700/50 border-gray-600">
                          <CardContent className="p-4 text-center">
                            <h4 className="font-semibold text-white mb-2">Overall Severity</h4>
                            <div className={`text-2xl font-bold mb-1 ${
                              finalAnalysis.overall_severity === 'Minimal' ? 'text-green-400' :
                              finalAnalysis.overall_severity === 'Mild' ? 'text-yellow-400' :
                              finalAnalysis.overall_severity === 'Moderate' ? 'text-orange-400' :
                              'text-red-400'
                            }`}>
                              {finalAnalysis.overall_severity}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-700/50 border-gray-600">
                          <CardContent className="p-4 text-center">
                            <h4 className="font-semibold text-white mb-2">Risk Level</h4>
                            <div className={`text-2xl font-bold mb-1 ${
                              finalAnalysis.risk_level === 'Low' ? 'text-green-400' :
                              finalAnalysis.risk_level === 'Medium' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {finalAnalysis.risk_level}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-700/50 border-gray-600">
                          <CardContent className="p-4 text-center">
                            <h4 className="font-semibold text-white mb-2">Assessments</h4>
                            <div className="text-2xl font-bold text-emerald-400 mb-1">
                              {Object.keys(assessmentResults).length}
                            </div>
                            <p className="text-xs text-gray-400">Completed</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Analysis Prompt */}
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-white">Your Personalized Analysis Prompt</span>
                            <div className="flex gap-2">
                              <Button onClick={copyAnalysisPrompt} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                <Copy className="w-4 h-4 mr-2" />
                                Copy for Chatbot
                              </Button>
                              <Button onClick={downloadAnalysis} size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </CardTitle>
                          <CardDescription>
                            Copy this detailed analysis and paste it into our AI chatbot for personalized guidance.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                              {finalAnalysis.analysis_prompt}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Next Steps */}
                      <Card className="bg-blue-900/20 border-blue-500/30">
                        <CardContent className="p-6">
                          <h4 className="font-semibold text-blue-300 mb-4">Next Steps</h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                              <div>
                                <p className="text-blue-200 font-medium">Copy Your Analysis</p>
                                <p className="text-blue-300 text-sm">Click "Copy for Chatbot" to get your personalized analysis prompt.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                              <div>
                                <p className="text-blue-200 font-medium">Get AI Guidance</p>
                                <p className="text-blue-300 text-sm">Paste your analysis into our AI chatbot for personalized recommendations and support.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                              <div>
                                <p className="text-blue-200 font-medium">Track Progress</p>
                                <p className="text-blue-300 text-sm">View your results in the dashboard and retake assessments to monitor progress.</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {/* Default Results State */}
                  {!isCompleting && !finalAnalysis && (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Complete All Assessments</h3>
                      <p className="text-gray-300">Finish all assessment steps to generate your comprehensive analysis.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            Step {currentStepIndex + 1} of {steps.length}
          </div>

          {currentStepIndex === steps.length - 1 ? (
            <Button
              onClick={() => router.push('/dashboard')}
              className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2"
            >
              View Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={currentStepIndex > 0 && !assessmentResults[currentStep.id] && currentStep.id !== 'additional'}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}