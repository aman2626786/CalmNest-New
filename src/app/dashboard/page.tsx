'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { localAuth } from '@/lib/localAuth';
import Link from 'next/link';
import { useTranslation, Trans } from 'react-i18next';
import { TestPerformanceChart } from '@/components/features/dashboard/TestPerformanceChart';
import { MoodGrooveChart } from '@/components/features/dashboard/MoodGrooveChart';
import { SummaryCard } from '@/components/features/dashboard/SummaryCard';
import { FacialAnalysisChart } from '@/components/features/dashboard/FacialAnalysisChart';
import { TestSubmission, MoodGrooveResult } from '@/types';
import html2canvas from 'html2canvas';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BarChart2, Smile, Activity, CheckCircle, Clock, Brain } from 'lucide-react';
import { FAQ } from '@/components/common/FAQ';

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

interface ComprehensiveAssessment {
  id: number;
  session_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  phq9_score: number | null;
  phq9_severity: string | null;
  gad7_score: number | null;
  gad7_severity: string | null;
  mood_groove_dominant_mood: string | null;
  mood_groove_confidence: number | null;
  mood_groove_depression: number | null;
  mood_groove_anxiety: number | null;
  resilience_score: number | null;
  stress_score: number | null;
  sleep_quality_score: number | null;
  social_support_score: number | null;
  overall_severity: string | null;
  risk_level: string | null;
  analysis_prompt: string | null;
  timestamp: string;
}

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
  comprehensive_assessments: ComprehensiveAssessment[];
  test_count: number;
  comprehensive_assessments_count: number;
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('date-filter-dropdown');
      const button = event.target as HTMLElement;
      if (dropdown && !dropdown.contains(button) && !button.closest('[data-dropdown-trigger]')) {
        dropdown.classList.add('hidden');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const currentUser = session?.user || localUser;
    
    if (currentUser?.id && currentUser?.email) {
      const fetchData = async () => {
        try {
          localStorage.setItem('userEmail', currentUser.email || '');
          localStorage.setItem('userId', currentUser.id);

          console.log('Dashboard: Fetching data for user:', {
            userId: currentUser.id,
            userEmail: currentUser.email
          });

          localStorage.setItem('debug_user_info', JSON.stringify({
            userId: currentUser.id,
            userEmail: currentUser.email,
            timestamp: new Date().toISOString()
          }));

          // For local auth users, show sample data instead of API calls
          if (localUser && !session?.user?.id) {
            console.log('Dashboard: Using sample data for local auth user');
            
            // Set sample data for local auth users
            setDashboardData({
              test_submissions: [],
              mood_groove_results: [],
              breathing_exercises: [],
              comprehensive_assessments: []
            });
            
            setStats({
              totalTests: 0,
              moodGrooveResults: 0,
              breathingExercises: 0,
              facialSessions: 0
            });
            
            setFacialAnalysisData({
              facial_analysis_sessions: [],
              total_sessions: 0
            });
            
            setLoading(false);
            return;
          }

          // Debug: Test the exact API call for real users
          console.log('Dashboard: API URL:', `http://127.0.0.1:5001/api/dashboard/unified/${currentUser.id}/${currentUser.email}`);

          const unifiedResponse = await fetch(`http://127.0.0.1:5001/api/dashboard/unified/${currentUser.id}/${currentUser.email}`);
          
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
              comprehensive_assessments: unifiedData.comprehensive_assessments || [],
              test_count: unifiedData.test_count,
              comprehensive_assessments_count: unifiedData.comprehensive_assessments_count || 0
            });
            setFacialAnalysisData({
              facial_analysis_sessions: unifiedData.facial_analysis_sessions,
              total_sessions: unifiedData.total_sessions
            });
          } else {
            console.error('Failed to fetch unified dashboard data. Status:', unifiedResponse.status);
            const errorText = await unifiedResponse.text();
            console.error('Error details:', errorText);
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
  }, [session, localUser]);

  const handleDownloadImage = (format: 'png' | 'jpg' = 'png') => {
    if (!dashboardRef.current) return;
    
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

  if (loading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Check for authentication (Supabase session or local auth)
  const [localUser, setLocalUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localAuth.getCurrentUser();
    setLocalUser(user);
    setIsAuthenticated(session?.user?.id || user);
  }, [session]);

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-lg mb-4">Please sign in to view your dashboard</p>
          <Link href="/login" className="text-blue-400 hover:underline text-lg">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Data processing
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
    if (data.length === 0) return '0';
    const totalScore = data.reduce((acc, sub) => acc + sub.score, 0);
    return (totalScore / data.length).toFixed(1);
  };

  const avgPhq9Score = calculateAverage(phq9Data);
  const avgGad7Score = calculateAverage(gad7Data);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8 pt-20">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
            <p className="text-gray-400 mt-1">Track your mental health journey</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Filter Dropdown */}
            <div className="relative">
              <button
                data-dropdown-trigger
                onClick={() => {
                  const dropdown = document.getElementById('date-filter-dropdown');
                  dropdown?.classList.toggle('hidden');
                }}
                className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors border border-gray-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {dateRange?.from ? 
                  `${dateRange.from.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString() || 'Select end'}` : 
                  'Filter by Date'
                }
              </button>
              
              <div id="date-filter-dropdown" className="hidden absolute right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 p-4">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  className="text-white"
                  classNames={{
                    months: "text-white",
                    month: "text-white",
                    caption: "text-white",
                    caption_label: "text-white font-medium",
                    nav: "text-white",
                    nav_button: "text-white hover:bg-gray-700 rounded",
                    nav_button_previous: "text-white hover:bg-gray-700",
                    nav_button_next: "text-white hover:bg-gray-700",
                    table: "text-white",
                    head_row: "text-gray-400",
                    head_cell: "text-gray-400 font-medium",
                    row: "text-white",
                    cell: "text-white hover:bg-gray-700 rounded",
                    day: "text-white hover:bg-gray-700 rounded p-2",
                    day_range_start: "bg-purple-600 text-white rounded",
                    day_range_end: "bg-purple-600 text-white rounded",
                    day_selected: "bg-purple-600 text-white rounded",
                    day_today: "bg-gray-700 text-white rounded font-bold",
                    day_outside: "text-gray-500",
                    day_disabled: "text-gray-600",
                    day_range_middle: "bg-purple-500/30 text-white",
                    day_hidden: "invisible",
                  }}
                />
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-600">
                  <button
                    onClick={() => {
                      setDateRange(undefined);
                      document.getElementById('date-filter-dropdown')?.classList.add('hidden');
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => document.getElementById('date-filter-dropdown')?.classList.add('hidden')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Date Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const today = new Date();
                  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                  setDateRange({ from: lastWeek, to: today });
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                  setDateRange({ from: lastMonth, to: today });
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
              >
                Last 30 Days
              </button>
            </div>

            {/* Download Button */}
            <div className="relative group">
              <button
                onClick={() => handleDownloadImage('png')}
                data-download-btn
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download Image
              </button>
              
              {/* Download Options Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
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

        {/* Active Filter Indicator */}
        {dateRange?.from && (
          <div className="mb-4 p-3 bg-purple-900/30 border border-purple-500/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                <span className="text-purple-300 font-medium">
                  Filtered: {dateRange.from.toLocaleDateString()} - {dateRange.to?.toLocaleDateString() || 'Present'}
                </span>
              </div>
              <button
                onClick={() => setDateRange(undefined)}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        )}

        <div ref={dashboardRef} className="bg-gray-900 p-6 rounded-lg">
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
                  title="Comprehensive Assessments" 
                  value={dashboardData?.comprehensive_assessments_count || 0} 
                  icon={<Activity className="h-6 w-6 text-emerald-400" />}
                  subtitle={`${dashboardData?.comprehensive_assessments?.filter(a => a.status === 'completed').length || 0} completed`}
                />
                <SummaryCard 
                  title="Avg. PHQ-9 Score" 
                  value={avgPhq9Score} 
                  icon={<BarChart2 className="h-6 w-6 text-purple-400" />}
                />
                <SummaryCard 
                  title="Mood Sessions" 
                  value={filteredMoodResults.length} 
                  icon={<Smile className="h-6 w-6 text-yellow-400" />}
                />
              </div>

              {phq9Data.length > 0 && (
                <TestPerformanceChart data={phq9Data} title="PHQ-9 Performance" />
              )}
              {gad7Data.length > 0 && (
                <TestPerformanceChart data={gad7Data} title="GAD-7 Performance" />
              )}

              {/* Comprehensive Assessments Section */}
              {dashboardData?.comprehensive_assessments && dashboardData.comprehensive_assessments.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                    <Activity className="h-6 w-6 text-emerald-400" />
                    Comprehensive Assessments
                  </h2>
                  <div className="grid gap-4">
                    {dashboardData.comprehensive_assessments.slice(0, 3).map((assessment) => (
                      <Card key={assessment.id} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                assessment.status === 'completed' ? 'bg-emerald-500/20' : 
                                assessment.status === 'in_progress' ? 'bg-yellow-500/20' : 'bg-gray-500/20'
                              }`}>
                                {assessment.status === 'completed' ? (
                                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                                ) : assessment.status === 'in_progress' ? (
                                  <Clock className="h-5 w-5 text-yellow-400" />
                                ) : (
                                  <Activity className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">
                                  Assessment #{assessment.id}
                                </h3>
                                <p className="text-sm text-gray-400">
                                  {new Date(assessment.started_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                assessment.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 
                                assessment.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-300' : 
                                'bg-gray-500/20 text-gray-300'
                              }`}>
                                {assessment.status === 'completed' ? 'Completed' : 
                                 assessment.status === 'in_progress' ? 'In Progress' : 'Abandoned'}
                              </div>
                            </div>
                          </div>
                          
                          {assessment.status === 'completed' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                              {assessment.phq9_score !== null && (
                                <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                                  <div className="text-lg font-bold text-purple-300">
                                    {assessment.phq9_score}
                                  </div>
                                  <div className="text-xs text-gray-400">PHQ-9</div>
                                  <div className="text-xs text-purple-400">
                                    {assessment.phq9_severity}
                                  </div>
                                </div>
                              )}
                              {assessment.gad7_score !== null && (
                                <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                                  <div className="text-lg font-bold text-blue-300">
                                    {assessment.gad7_score}
                                  </div>
                                  <div className="text-xs text-gray-400">GAD-7</div>
                                  <div className="text-xs text-blue-400">
                                    {assessment.gad7_severity}
                                  </div>
                                </div>
                              )}
                              {assessment.mood_groove_dominant_mood && (
                                <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                                  <div className="text-lg font-bold text-yellow-300 capitalize">
                                    {assessment.mood_groove_dominant_mood}
                                  </div>
                                  <div className="text-xs text-gray-400">Mood</div>
                                  <div className="text-xs text-yellow-400">
                                    {assessment.mood_groove_confidence ? 
                                      `${(assessment.mood_groove_confidence * 100).toFixed(0)}% confidence` : 
                                      'Analyzed'
                                    }
                                  </div>
                                </div>
                              )}
                              {assessment.overall_severity && (
                                <div className="text-center p-3 bg-emerald-500/10 rounded-lg">
                                  <div className="text-lg font-bold text-emerald-300">
                                    {assessment.overall_severity}
                                  </div>
                                  <div className="text-xs text-gray-400">Overall</div>
                                  <div className="text-xs text-emerald-400">
                                    {assessment.risk_level || 'Assessed'}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {assessment.analysis_prompt && (
                            <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Brain className="h-4 w-4 text-purple-400" />
                                <span className="text-sm font-medium text-purple-300">
                                  AI Analysis Available
                                </span>
                              </div>
                              <p className="text-xs text-gray-400">
                                Comprehensive analysis prompt generated for chatbot guidance
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {filteredMoodResults.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-white">{t('moodAnalysis')}</h2>
                  <MoodGrooveChart data={filteredMoodResults} />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 p-8 rounded-lg text-center shadow-lg">
              <p className="text-gray-400 text-lg">{t('noData')}</p>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <FAQ 
          title="Dashboard FAQ"
          faqs={[
            {
              question: "How do I interpret my test scores?",
              answer: "PHQ-9 scores: 0-4 (minimal), 5-9 (mild), 10-14 (moderate), 15-19 (moderately severe), 20-27 (severe). GAD-7 scores: 0-4 (minimal), 5-9 (mild), 10-14 (moderate), 15-21 (severe). Higher scores indicate more symptoms."
            },
            {
              question: "How often should I take the assessments?",
              answer: "We recommend taking assessments weekly or bi-weekly to track your progress. However, you can take them as often as you feel necessary to monitor your mental health."
            },
            {
              question: "Can I download my data?",
              answer: "Yes! Use the 'Download Image' button to save your dashboard as a PNG or JPG file. This is useful for sharing with healthcare providers or keeping personal records."
            },
            {
              question: "What do the mood analysis charts show?",
              answer: "The mood analysis charts display your emotional patterns over time based on Mood Groove sessions. They help identify trends and patterns in your emotional well-being."
            },
            {
              question: "How can I filter my data by date?",
              answer: "Use the date filter dropdown to select custom date ranges, or click the quick filter buttons for 'Last 7 Days' or 'Last 30 Days' to view specific time periods."
            }
          ]}
          className="mt-12"
        />
      </div>
    </div>
  );
};

export default DashboardPage;