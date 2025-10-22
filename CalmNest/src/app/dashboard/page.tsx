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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { FileText, BarChart2, Smile } from 'lucide-react';

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

          // Use unified dashboard endpoint for consistent data fetching
          const unifiedResponse = await fetch(`http://127.0.0.1:5001/api/dashboard/unified/${session.user.id}/${session.user.email}`);
          if (unifiedResponse.ok) {
            const unifiedData = await unifiedResponse.json();
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
            // Fallback to individual endpoints
            const dashboardResponse = await fetch(`http://127.0.0.1:5001/dashboard/${session.user.id}`);
            if (dashboardResponse.ok) {
              const data = await dashboardResponse.json();
              setDashboardData(data);
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

  const handleDownloadPdf = () => {
    if (dashboardRef.current) {
      html2canvas(dashboardRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('dashboard-report.pdf');
      });
    }
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <div className="flex items-center gap-4">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              className="bg-gray-800 rounded-md"
            />
            <Button onClick={() => setDateRange(undefined)}>Clear Filter</Button>
            <button
              onClick={handleDownloadPdf}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {t('downloadPdf')}
            </button>
          </div>
        </div>

        <div ref={dashboardRef}>
          {dashboardData ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <SummaryCard title="Total Tests Taken" value={filteredSubmissions.length} icon={<FileText className="h-6 w-6 text-gray-400" />} />
                <SummaryCard title="Avg. PHQ-9 Score" value={avgPhq9Score} icon={<BarChart2 className="h-6 w-6 text-gray-400" />} />
                <SummaryCard title="Avg. GAD-7 Score" value={avgGad7Score} icon={<BarChart2 className="h-6 w-6 text-gray-400" />} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {phq9Data.length > 0 && (
                  <TestPerformanceChart data={phq9Data} title="PHQ-9 Performance" />
                )}
                {gad7Data.length > 0 && (
                  <TestPerformanceChart data={gad7Data} title="GAD-7 Performance" />
                )}
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