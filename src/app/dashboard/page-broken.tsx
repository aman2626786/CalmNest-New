'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useTranslation, Trans } from 'react-i18next';
import { TestPerformanceChart } from '@/components/features/dashboard/TestPerformanceChart';
import { MoodGrooveChart } from '@/components/features/dashboard/MoodGrooveChart';
import { SummaryCard } from '@/components/features/dashboard/SummaryCard';
import { FacialAnalysisChart } from '@/components/features/dashboard/FacialAnalysisChart';
import { TestSubmission, MoodGrooveResult } from '@/types';

interface FacialAnalysisSession {
  id: number;
  user_email: string;
  session_start_time: string;
  session_end_time: string;
  total_detections: number;
  dominant_mood: string;
  avg_confidence: number;
  avg_depression: number;
  avg_anxiety: number;
  mood_distribution: Record<string, number>;
  raw_data: any[];
  timestamp: string;
}
import html2canvas from 'html2canvas';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BarChart2, Smile } from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  test_submissions: TestSubmission[];
  mood_groove_results: MoodGrooveResult[];
  breathing_exercises: {
    id: number;
    user_id: string;
    exercise_name: string;
    duration_seconds: number;
    timestamp: string;
  }[];
  test_count: number;
}

interface FacialAnalysisData {
  facial_analysis_sessions: FacialAnalysisSession[];
  total_sessions: number;
}

const DashboardPage = () => {
  const session = useSession();
  const { t } = useTranslation('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [facialAnalysisData, setFacialAnalysisData] = useState<FacialAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    if (session?.user?.id && session?.user?.email) {
      const fetchData = async () => {
        try {
          // Store user info in localStorage for consistent access
          localStorage.setItem('userEmail', session.user.email || '');
          localStorage.setItem('userId', session.user.id);

          // Debug logging
          console.log('Dashboard: Fetching data for user:', {
            userId: session.user.id,
            userEmail: session.user.email
          });

          // Also log to localStorage for debugging
          localStorage.setItem('debug_user_info', JSON.stringify({
            userId: session.user.id,
            userEmail: session.user.email,
            timestamp: new Date().toISOString()
          }));

          // Use unified dashboard endpoint for consistent data fetching
          const unifiedResponse = await fetch(`http://127.0.0.1:5001/api/dashboard/unified/${session.user.id}/${session.user.email}`);
          
          console.log('Dashboard: Unified response status:', unifiedResponse.status);
          
          if (unifiedResponse.ok) {
            const unifiedData = await unifiedResponse.json();
            console.log('Dashboard: Unified data received:', {
              testSubmissions: unifiedData.test_submissions?.length || 0,
              moodGrooveResults: unifiedData.mood_groove_results?.length || 0,
              breathingExercises: unifiedData.breathing_exercises?.length || 0,
              facialSessions: unifiedData.facial_analysis_sessions?.length || 0
            });
            
            setDashboardData({
              test_submissions: unifiedData.test_submissions,
              mood_groove_results: unifiedData.mood_groove_results,
              breathing_exercises: unifiedData.breathing_exercises,
              test_count: unifiedData.test_count
            });
            setFacialAnalysisData({
              facial_analysis_sessions: unifiedData.facial_analysis_sessions,
              total_sessions: unifiedData.total_sessions
            });
          } else {
            console.error('Failed to fetch unified dashboard data. Status:', unifiedResponse.status);
            const errorText = await unifiedResponse.text();
            console.error('Error details:', errorText);
            
            // Fallback to individual endpoints
            console.log('Dashboard: Trying fallback endpoint');
            const dashboardResponse = await fetch(`http://127.0.0.1:5001/dashboard/${session.user.id}`);
            if (dashboardResponse.ok) {
              const data = await dashboardResponse.json();
              console.log('Dashboard: Fallback data received:', {
                testSubmissions: data.test_submissions?.length || 0,
                moodGrooveResults: data.mood_groove_results?.length || 0
              });
              setDashboardData(data);
            } else {
              console.error('Fallback endpoint also failed:', dashboardResponse.status);
              
              // Last resort: Try to fetch all data and filter by email
              console.log('Dashboard: Trying email-based data fetch');
              try {
                const allTestsResponse = await fetch('http://127.0.0.1:5001/api/test-submissions-all');
                if (allTestsResponse.ok) {
                  const allTests = await allTestsResponse.json();
                  console.log('Dashboard: Found all tests, filtering by user');
                  // This would need a new endpoint, but for now just log
                }
              } catch (e) {
                console.error('All fallbacks failed:', e);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleDownloadImage = (format: 'png' | 'jpg' = 'png') => {
    if (!dashboardRef.current) return;
    
    // Show loading state
    const button = document.querySelector('[data-download-btn]') as HTMLButtonElement;
    if (button) {
      button.disabled = true;
      button.textContent = 'Generating...';
    }

    html2canvas(dashboardRef.current, {
      backgroundColor: format === 'jpg' ? '#111827' : null,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      width: dashboardRef.current.scrollWidth,
      height: dashboardRef.current.scrollHeight,
      scrollX: 0,
      scrollY: 0
    }).then((canvas) => {
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
      
      if (format === 'jpg') {
        link.download = `calmnest-dashboard-${timestamp}-${time}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
      } else {
        link.download = `calmnest-dashboard-${timestamp}-${time}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Dashboard ${format.toUpperCase()} downloaded successfully!`);
    }).catch((error) => {
      console.error('Error generating dashboard image:', error);
      alert('Failed to download dashboard image. Please try again.');
    }).finally(() => {
      if (button) {
        button.disabled = false;
        button.innerHTML = `<svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>Download Image`;
      }
    });
  };

  const filteredSubmissions = dashboardData?.test_submissions.filter(sub => {
    if (!dateRange?.from) return true;
    const submissionDate = new Date(sub.timestamp);
    if (dateRange.to) {
      return submissionDate >= dateRange.from && submissionDate <= dateRange.to;
    }
    return submissionDate >= dateRange.from;
  }) || [];

  const filteredMoodResults = dashboardData?.mood_groove_results.filter(res => {
    if (!dateRange?.from) return true;
    const resultDate = new Date(res.timestamp);
    if (dateRange.to) {
      return resultDate >= dateRange.from && resultDate <= dateRange.to;
    }
    return resultDate >= dateRange.from;
  }) || [];

  const breathingLogs = dashboardData?.breathing_exercises || [];

  const phq9Data = filteredSubmissions.filter(sub => sub.test_type === 'PHQ9');
  const gad7Data = filteredSubmissions.filter(sub => sub.test_type === 'GAD7');

  const calculateAverage = (data: TestSubmission[]) => {
    if (data.length === 0) return 0;
    const totalScore = data.reduce((acc, sub) => acc + sub.score, 0);
    return (totalScore / data.length).toFixed(1);
  };

  const avgPhq9Score = calculateAverage(phq9Data);
  const avgGad7Score = calculateAverage(gad7Data);

  const getSeverityLevel = (score: number, testType: string) => {
    if (testType === 'PHQ9') {
      if (score >= 20) return 'Severe';
      if (score >= 15) return 'Moderate';
      if (score >= 10) return 'Moderate';
      if (score >= 5) return 'Mild';
      return 'Minimal';
    } else if (testType === 'GAD7') {
      if (score >= 15) return 'Severe';
      if (score >= 10) return 'Moderate';
      if (score >= 5) return 'Mild';
      return 'Minimal';
    }
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-lg">{t('notLoggedIn')}</p>
          <Link href="/login" className="text-blue-400 hover:underline">
            {t('loginToView')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8 pt-20">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
            <p className="text-gray-400 mt-1">Track your mental health journey</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              className="bg-gray-800 rounded-md"
            />
            <Button onClick={() => setDateRange(undefined)} variant="outline">
              Clear Filter
            </Button>
            <div className="relative group">
              <button
                onClick={() => handleDownloadImage('png')}
                data-download-btn
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download Image
              </button>
              
              {/* Dropdown for format options */}
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => handleDownloadImage('png')}
                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-t-md transition-colors"
                >
                  📷 Download as PNG (High Quality)
                </button>
                <button
                  onClick={() => handleDownloadImage('jpg')}
                  className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-b-md transition-colors"
                >
                  🖼️ Download as JPG (Smaller Size)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/self-check" className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition-colors">
              <FileText className="h-6 w-6 mx-auto mb-2" />
              <p className="font-medium">Take Test</p>
            </Link>
            <Link href="/mood-groove" className="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-lg text-center transition-colors">
              <Smile className="h-6 w-6 mx-auto mb-2" />
              <p className="font-medium">Mood Check</p>
            </Link>
            <Link href="/guided-breathing" className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition-colors">
              <BarChart2 className="h-6 w-6 mx-auto mb-2" />
              <p className="font-medium">Breathing</p>
            </Link>
            <Link href="/appointments" className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition-colors">
              <FileText className="h-6 w-6 mx-auto mb-2" />
              <p className="font-medium">Book Session</p>
            </Link>
          </div>
        </div>

        <div ref={dashboardRef} className="bg-gray-900 p-6 rounded-lg"
             style={{ 
               background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
               minHeight: '100vh'
             }}>
          {dashboardData ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SummaryCard 
                  title="Total Tests Taken" 
                  value={filteredSubmissions.length} 
                  icon={<FileText className="h-6 w-6 text-blue-400" />}
                  subtitle={`${phq9Data.length} PHQ-9, ${gad7Data.length} GAD-7`}
                />
                <SummaryCard 
                  title="Avg. PHQ-9 Score" 
                  value={avgPhq9Score} 
                  icon={<BarChart2 className="h-6 w-6 text-purple-400" />}
                  subtitle={phq9Data.length > 0 ? getSeverityLevel(parseFloat(avgPhq9Score), 'PHQ9') : 'No data'}
                />
                <SummaryCard 
                  title="Avg. GAD-7 Score" 
                  value={avgGad7Score} 
                  icon={<BarChart2 className="h-6 w-6 text-green-400" />}
                  subtitle={gad7Data.length > 0 ? getSeverityLevel(parseFloat(avgGad7Score), 'GAD7') : 'No data'}
                />
                <SummaryCard 
                  title="Mood Sessions" 
                  value={filteredMoodResults.length} 
                  icon={<Smile className="h-6 w-6 text-yellow-400" />}
                  subtitle={filteredMoodResults.length > 0 ? `Latest: ${filteredMoodResults[filteredMoodResults.length - 1]?.dominant_mood}` : 'No sessions'}
                />
              </div>

              {/* Progress Overview */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-white">Progress Overview</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {phq9Data.length > 0 && (
                    <div>
                      <TestPerformanceChart data={phq9Data} title="PHQ-9 Performance" />
                      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Progress Trend</span>
                          <span className="text-white font-medium">
                            {phq9Data.length >= 2 ? 
                              (phq9Data[phq9Data.length - 1].score < phq9Data[phq9Data.length - 2].score ? 
                                '📈 Improving' : '📉 Needs Attention') : 
                              '📊 Baseline Set'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {gad7Data.length > 0 && (
                    <div>
                      <TestPerformanceChart data={gad7Data} title="GAD-7 Performance" />
                      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Progress Trend</span>
                          <span className="text-white font-medium">
                            {gad7Data.length >= 2 ? 
                              (gad7Data[gad7Data.length - 1].score < gad7Data[gad7Data.length - 2].score ? 
                                '📈 Improving' : '📉 Needs Attention') : 
                              '📊 Baseline Set'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {filteredMoodResults.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">{t('moodAnalysis')}</h2>
                  <MoodGrooveChart data={filteredMoodResults} />
                </div>
              )}

              {/* Breathing Exercise Logs */}
              {breathingLogs.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Guided Breathing Sessions</h2>
                  
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-400">{breathingLogs.length}</p>
                      <p className="text-gray-400">Total Sessions</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-400">
                        {Math.round(breathingLogs.reduce((sum, log) => sum + log.duration_seconds, 0) / 60)}m
                      </p>
                      <p className="text-gray-400">Total Time</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-400">
                        {Math.round(breathingLogs.reduce((sum, log) => sum + log.duration_seconds, 0) / breathingLogs.length)}s
                      </p>
                      <p className="text-gray-400">Avg Duration</p>
                    </div>
                  </div>
                  
                  {/* Recent Sessions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {breathingLogs.slice(0, 6).map((log) => (
                      <div key={log.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-white">{log.exercise_name}</p>
                            <p className="text-sm text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-purple-400">{log.duration_seconds}s</p>
                            <p className="text-xs text-gray-400">Duration</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${Math.min((log.duration_seconds / 300) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {breathingLogs.length > 6 && (
                    <div className="text-center mt-4">
                      <p className="text-gray-400">And {breathingLogs.length - 6} more sessions...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Recent Activity Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-white">Recent Activity</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Tests */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-400" />
                        Recent Tests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {filteredSubmissions.slice(-3).reverse().map((test) => (
                        <div key={test.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                          <div>
                            <p className="text-white font-medium">{test.test_type}</p>
                            <p className="text-gray-400 text-sm">{new Date(test.timestamp).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">{test.score}</p>
                            <p className="text-gray-400 text-sm">{test.severity}</p>
                          </div>
                        </div>
                      ))}
                      {filteredSubmissions.length === 0 && (
                        <p className="text-gray-400 text-center py-4">No tests taken yet</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Mood Sessions */}
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Smile className="h-5 w-5 text-yellow-400" />
                        Recent Mood Sessions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {filteredMoodResults.slice(-3).reverse().map((mood) => (
                        <div key={mood.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                          <div>
                            <p className="text-white font-medium capitalize">{mood.dominant_mood}</p>
                            <p className="text-gray-400 text-sm">{new Date(mood.timestamp).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">{(mood.confidence * 100).toFixed(1)}%</p>
                            <p className="text-gray-400 text-sm">Confidence</p>
                          </div>
                        </div>
                      ))}
                      {filteredMoodResults.length === 0 && (
                        <p className="text-gray-400 text-center py-4">No mood sessions yet</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Facial Analysis Section */}
              {facialAnalysisData && facialAnalysisData.facial_analysis_sessions.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Facial Expression Analysis</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-4">Session Summary</h3>
                      <div className="space-y-2">
                        <p><span className="font-semibold">Total Sessions:</span> {facialAnalysisData.total_sessions}</p>
                        <p><span className="font-semibold">Latest Session:</span> {facialAnalysisData.facial_analysis_sessions[0]?.dominant_mood}</p>
                        <p><span className="font-semibold">Avg Confidence:</span> {facialAnalysisData.facial_analysis_sessions[0]?.avg_confidence.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-4">Mental Health Indicators</h3>
                      <div className="space-y-2">
                        <p><span className="font-semibold">Avg Depression:</span> {facialAnalysisData.facial_analysis_sessions[0]?.avg_depression.toFixed(1)}%</p>
                        <p><span className="font-semibold">Avg Anxiety:</span> {facialAnalysisData.facial_analysis_sessions[0]?.avg_anxiety.toFixed(1)}%</p>
                        <p><span className="font-semibold">Total Detections:</span> {facialAnalysisData.facial_analysis_sessions[0]?.total_detections}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4">Recent Sessions</h3>
                    <div className="space-y-4">
                      {facialAnalysisData.facial_analysis_sessions.slice(0, 3).map((session) => (
                        <div key={session.id} className="bg-gray-800 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">Session {session.id}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(session.session_start_time).toLocaleDateString()} - 
                                {new Date(session.session_end_time).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">{session.dominant_mood}</p>
                              <p className="text-sm text-gray-400">{session.total_detections} detections</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Facial Analysis Charts */}
                  <div className="mt-8">
                    <FacialAnalysisChart data={facialAnalysisData.facial_analysis_sessions} />
                  </div>
                </div>
              )}
            </div>

            {/* Watermark for downloaded images */}
            <div className="mt-8 text-center opacity-50">
              <p className="text-gray-500 text-sm">
                Generated by CalmNest • {new Date().toLocaleDateString()} • Mental Health Dashboard
              </p>
            </div>
          ) : (
            <div className="bg-gray-800 p-8 rounded-lg text-center shadow-lg">
              <p className="text-gray-400 text-lg">{t('noData')}</p>
              <p className="mt-2 text-gray-500">
                <Trans t={t} i18nKey="startActivities">
                  Start taking tests or use Mood Groove to see your dashboard.
                </Trans>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;