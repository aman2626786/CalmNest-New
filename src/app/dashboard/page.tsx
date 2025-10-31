'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { API_CONFIG } from '@/config/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

type DashboardStatus = 'idle' | 'loading' | 'success' | 'error';

interface DashboardState {
  data: any | null;
  status: DashboardStatus;
  error: string | null;
  lastFetchTime: number | null;
}

export default function DashboardPage() {
  const { t } = useTranslation(['dashboard', 'common']);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    data: null,
    status: 'idle',
    error: null,
    lastFetchTime: null,
  });

  const downloadDashboardImage = useCallback(async () => {
    try {
      const dashboardElement = document.getElementById('dashboard-container');
      if (!dashboardElement) return;

      const canvas = await html2canvas(dashboardElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: dashboardElement.scrollWidth,
        height: dashboardElement.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });

      const link = document.createElement('a');
      link.download = `mental-health-dashboard-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.png`;
      link.href = canvas.toDataURL('image/png');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading dashboard image:', error);
    }
  }, []);

  const downloadReport = useCallback(() => {
    if (!dashboardState.data) return;

    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(16);
    
    doc.text('Mental Health Analysis Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'MM/dd/yyyy')}`, 20, 30);
    doc.text(`User: ${dashboardState.data?.user_profile?.full_name || 'Anonymous'}`, 20, 40);

    let yPosition = 60;

    if (dashboardState.data?.test_submissions?.length > 0) {
      doc.setFontSize(14);
      doc.text('Test Submissions Summary', 20, yPosition);
      yPosition += 10;
      
      const testData = dashboardState.data.test_submissions.map((test: any) => [
        format(new Date(test.timestamp), 'MM/dd/yyyy'),
        test.test_type,
        test.score.toString(),
        test.severity,
      ]);

      (doc as any).autoTable({
        startY: yPosition,
        head: [['Date', 'Test Type', 'Score', 'Severity']],
        body: testData,
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }

    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    if (dashboardState.data?.mood_groove_results?.length > 0) {
      doc.setFontSize(14);
      doc.text('Mood Analysis Summary', 20, yPosition);
      yPosition += 10;

      const moodData = dashboardState.data.mood_groove_results.map((result: any) => [
        format(new Date(result.timestamp), 'MM/dd/yyyy'),
        result.dominant_mood,
        result.confidence.toFixed(2),
        result.depression.toFixed(2),
        result.anxiety.toFixed(2),
      ]);

      
      (doc as any).autoTable({
        startY: yPosition,
        head: [['Date', 'Mood', 'Confidence', 'Depression', 'Anxiety']],
        body: moodData,
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }

    doc.save('mental-health-analysis-report.pdf');
  }, [dashboardState.data]);

  const fetchDashboardData = useCallback(async (email: string) => {
    const startTime = Date.now();
    console.log(`[Dashboard] Starting API fetch for email: ${email}`);
    
    try {
      setDashboardState(prev => {
        console.log(`[Dashboard] State transition: ${prev.status} → loading`);
        return {
          ...prev,
          status: 'loading',
          error: null,
        };
      });

      const apiUrl = `${API_CONFIG.BASE_URL}/api/dashboard/${email}`;
      console.log(`[Dashboard] API URL: ${apiUrl}`);
      console.log(`[Dashboard] BASE_URL: ${API_CONFIG.BASE_URL}`);
      console.log(`[Dashboard] NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}`);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const fetchDuration = Date.now() - startTime;
      console.log(`[Dashboard] API fetch completed in ${fetchDuration}ms. Data summary:`, {
        testSubmissions: data.test_submissions?.length || 0,
        moodResults: data.mood_groove_results?.length || 0,
        comprehensiveAssessments: data.comprehensive_assessments?.length || 0,
        userProfile: !!data.user_profile
      });
      
      setDashboardState({
        data,
        status: 'success',
        error: null,
        lastFetchTime: Date.now(),
      });
      
      console.log(`[Dashboard] State transition: loading → success`);
    } catch (error) {
      const fetchDuration = Date.now() - startTime;
      console.error(`[Dashboard] API fetch failed after ${fetchDuration}ms:`, error);
      setDashboardState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to load dashboard data',
      }));
      console.log(`[Dashboard] State transition: loading → error`);
    }
  }, []);

  useEffect(() => {
    if (authLoading) {
      console.log('[Dashboard] Waiting for auth to complete...');
      return;
    }
    
    const email = user?.email;
    
    console.log(`[Dashboard] Effect triggered - Auth: ${authLoading ? 'loading' : 'ready'}, Email: ${email}, Status: ${dashboardState.status}`);
    
    // If no user is logged in, show error instead of redirect to avoid loops
    if (!user && !email) {
      console.log('[Dashboard] No user found, setting error state');
      setDashboardState(prev => ({
        ...prev,
        status: 'error',
        error: 'Please log in to view your dashboard'
      }));
      return;
    }
    
    // Only fetch data if we haven't fetched it yet and we're not already loading
    if (dashboardState.status === 'idle' && email) {
      console.log(`[Dashboard] Conditions met for data fetch - triggering API call`);
      fetchDashboardData(email);
    } else if (dashboardState.status !== 'idle') {
      console.log(`[Dashboard] Skipping fetch - status is ${dashboardState.status}`);
    }
  }, [authLoading, user?.email, dashboardState.status, fetchDashboardData, router]);

  // Reset dashboard state when user changes
  useEffect(() => {
    if (!authLoading && user?.email) {
      console.log(`[Dashboard] User changed to: ${user.email}, resetting dashboard state`);
      setDashboardState({
        data: null,
        status: 'idle',
        error: null,
        lastFetchTime: null,
      });
    }
  }, [user?.email, authLoading]);

  useEffect(() => {
    const handleDownload = () => {
      downloadReport();
    };
    window.addEventListener('downloadReport', handleDownload);

    return () => {
      window.removeEventListener('downloadReport', handleDownload);
    };
  }, [downloadReport]);

  const processTestSubmissionData = () => {
    if (!dashboardState.data?.test_submissions) return [];
    
    return dashboardState.data.test_submissions.map((test: any) => ({
      date: format(new Date(test.timestamp), 'MM/dd/yyyy'),
      score: test.score,
      type: test.test_type,
      severity: test.severity,
    }));
  };

  const processPHQ9Data = () => {
    if (!dashboardState.data?.test_submissions) return [];
    
    return dashboardState.data.test_submissions
      .filter((test: any) => {
        const testType = test.test_type?.toUpperCase();
        return testType === 'PHQ9';
      })
      .map((test: any) => ({
        date: format(new Date(test.timestamp), 'MM/dd/yyyy'),
        score: test.score,
        severity: test.severity,
      }));
  };

  const processGAD7Data = () => {
    if (!dashboardState.data?.test_submissions) return [];
    
    return dashboardState.data.test_submissions
      .filter((test: any) => {
        const testType = test.test_type?.toUpperCase();
        return testType === 'GAD7';
      })
      .map((test: any) => ({
        date: format(new Date(test.timestamp), 'MM/dd/yyyy'),
        score: test.score,
        severity: test.severity,
      }));
  };

  const processMoodGrooveData = () => {
    if (!dashboardState.data?.mood_groove_results) return [];

    return dashboardState.data.mood_groove_results.map((result: any) => ({
      date: format(new Date(result.timestamp), 'MM/dd/yyyy'),
      confidence: result.confidence,
      depression: result.depression,
      anxiety: result.anxiety,
      mood: result.dominant_mood,
    }));
  };

  const processComprehensiveData = () => {
    if (!dashboardState.data?.comprehensive_assessments) return [];

    return dashboardState.data.comprehensive_assessments.map((assessment: any) => ({
      date: format(new Date(assessment.timestamp), 'MM/dd/yyyy'),
      phq9Score: assessment.phq9_score,
      gad7Score: assessment.gad7_score,
      resilienceScore: assessment.resilience_score,
      stressScore: assessment.stress_score,
      sleepScore: assessment.sleep_quality_score,
      socialScore: assessment.social_support_score,
      overallSeverity: assessment.overall_severity,
      riskLevel: assessment.risk_level,
    }));
  };

  const calculateMoodDistribution = () => {
    if (!dashboardState.data?.mood_groove_results) return [];

    const moodCounts = dashboardState.data.mood_groove_results.reduce((acc: any, result: any) => {
      acc[result.dominant_mood] = (acc[result.dominant_mood] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
    }));
  };

  const handleRetry = () => {
    const email = user?.email;
    
    console.log(`[Dashboard] Manual retry triggered for email: ${email}`);
    
    setDashboardState(prev => {
      console.log(`[Dashboard] State transition: ${prev.status} → idle (retry)`);
      return {
        ...prev,
        status: 'idle',
        error: null,
      };
    });
    
    if (email) {
      fetchDashboardData(email);
    } else {
      console.error('[Dashboard] Cannot retry - no email available');
    }
  };

  if (authLoading || dashboardState.status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500" role="status" aria-label="Loading dashboard data"></div>
      </div>
    );
  }

  if (dashboardState.status === 'error') {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-red-500 text-xl font-semibold">Error Loading Dashboard</div>
          <div className="text-gray-600 text-center max-w-md">{dashboardState.error}</div>
          <div className="flex gap-4">
            {dashboardState.error?.includes('log in') ? (
              <Button onClick={() => router.push('/login')} className="mt-4">
                Go to Login
              </Button>
            ) : (
              <Button onClick={handleRetry} className="mt-4">
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6" id="dashboard-container">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          {dashboardState.data?.user_profile && (
            <p className="text-sm text-gray-600 mt-1">
              {dashboardState.data.user_profile.full_name} • {format(new Date(), 'MMMM dd, yyyy')}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadDashboardImage} variant="outline" size="sm">
            📸 Download Image
          </Button>
          <Button onClick={downloadReport} variant="outline" size="sm">
            📄 Download PDF
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="moodAnalysis">{t('tabs.moodAnalysis')}</TabsTrigger>
          <TabsTrigger value="comprehensiveAnalysis">{t('tabs.comprehensiveAnalysis')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t('cards.testsSummary')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{dashboardState.data?.test_count || 0}</p>
                <p className="text-sm text-gray-500">{t('cards.totalTests')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('cards.moodSessions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{dashboardState.data?.total_sessions || 0}</p>
                <p className="text-sm text-gray-500">{t('cards.totalSessions')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('cards.assessments')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {dashboardState.data?.comprehensive_assessments_count || 0}
                </p>
                <p className="text-sm text-gray-500">{t('cards.totalAssessments')}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mt-6 md:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>PHQ-9 Depression Scores</CardTitle>
              </CardHeader>
              <CardContent>
                {processPHQ9Data().length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={processPHQ9Data().slice(-10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 27]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#8884d8" name="PHQ-9 Score" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    No PHQ-9 test data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GAD-7 Anxiety Scores</CardTitle>
              </CardHeader>
              <CardContent>
                {processGAD7Data().length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={processGAD7Data().slice(-10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 21]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#82ca9d" name="GAD-7 Score" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    No GAD-7 test data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('cards.recentActivity')}</CardTitle>
            </CardHeader>
            <CardContent>
              {processTestSubmissionData().length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={processTestSubmissionData().slice(-10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  {t('noData')}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moodAnalysis">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('cards.moodTrends')}</CardTitle>
              </CardHeader>
              <CardContent>
                {processMoodGrooveData().length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={processMoodGrooveData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="depression" stroke="#FF8042" />
                      <Line type="monotone" dataKey="anxiety" stroke="#FFBB28" />
                      <Line type="monotone" dataKey="confidence" stroke="#00C49F" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-gray-500">
                    {t('noData')}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('cards.moodDistribution')}</CardTitle>
              </CardHeader>
              <CardContent>
                {calculateMoodDistribution().length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={calculateMoodDistribution()}
                        dataKey="count"
                        nameKey="mood"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {calculateMoodDistribution().map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    {t('noData')}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comprehensiveAnalysis">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('cards.mentalHealthScores')}</CardTitle>
              </CardHeader>
              <CardContent>
                {processComprehensiveData().length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={processComprehensiveData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="phq9Score" stroke="#8884d8" name="PHQ-9" />
                      <Line type="monotone" dataKey="gad7Score" stroke="#82ca9d" name="GAD-7" />
                      <Line type="monotone" dataKey="resilienceScore" stroke="#ffc658" name="Resilience" />
                      <Line type="monotone" dataKey="stressScore" stroke="#ff7300" name="Stress" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-gray-500">
                    {t('noData')}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('cards.sleepQuality')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={processComprehensiveData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sleepScore" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('cards.socialSupport')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={processComprehensiveData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="socialScore" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}