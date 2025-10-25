'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MoodGrooveResult } from '@/types';
import { format } from 'date-fns';

interface MoodGrooveChartProps {
  data: MoodGrooveResult[];
}

export const MoodGrooveChart: React.FC<MoodGrooveChartProps> = ({ data }) => {
  const moodCounts = data.reduce((acc, result) => {
    const mood = result.dominant_mood;
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(moodCounts).map(mood => ({
    mood,
    count: moodCounts[mood],
  }));

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-300">Mood Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="mood" stroke="#A0AEC0" />
          <YAxis stroke="#A0AEC0" />
          <Tooltip
            contentStyle={{ backgroundColor: '#2D3748', border: 'none' }}
            labelStyle={{ color: '#E2E8F0' }}
          />
          <Legend wrapperStyle={{ color: '#E2E8F0' }} />
          <Bar dataKey="count" fill="#4299E1" name="Mood Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
