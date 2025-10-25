'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

interface FacialAnalysisChartProps {
  data: FacialAnalysisSession[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff0000', '#0000ff'];

export const FacialAnalysisChart: React.FC<FacialAnalysisChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Facial Expression Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No facial analysis data available</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts
  const moodDistributionData = Object.entries(data[0]?.mood_distribution || {}).map(([mood, count]) => ({
    mood,
    count,
    percentage: ((count / data[0]?.total_detections) * 100).toFixed(1)
  }));

  const sessionData = data.map((session, index) => ({
    session: `Session ${index + 1}`,
    depression: session.avg_depression,
    anxiety: session.avg_anxiety,
    confidence: session.avg_confidence * 100,
    detections: session.total_detections
  }));

  return (
    <div className="space-y-6">
      {/* Mood Distribution Pie Chart */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Mood Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={moodDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ mood, percentage }) => `${mood} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {moodDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Session Analysis Bar Chart */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Session Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="session" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="depression" fill="#ef4444" name="Depression %" />
              <Bar dataKey="anxiety" fill="#f59e0b" name="Anxiety %" />
              <Bar dataKey="confidence" fill="#10b981" name="Confidence %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mental Health Trends */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Mental Health Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">
                {data.reduce((sum, session) => sum + session.avg_depression, 0) / data.length}%
              </p>
              <p className="text-gray-400">Avg Depression</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {data.reduce((sum, session) => sum + session.avg_anxiety, 0) / data.length}%
              </p>
              <p className="text-gray-400">Avg Anxiety</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {data.reduce((sum, session) => sum + session.avg_confidence, 0) / data.length}%
              </p>
              <p className="text-gray-400">Avg Confidence</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
