'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TestSubmission } from '@/types';
import { format } from 'date-fns';

interface TestPerformanceChartProps {
  data: TestSubmission[];
  title: string;
}

export const TestPerformanceChart: React.FC<TestPerformanceChartProps> = ({ data, title }) => {
  const chartData = data.map(submission => ({
    date: format(new Date(submission.timestamp), 'MMM d'),
    score: submission.score,
    severity: submission.severity,
  }));

  console.log(`Chart data for ${title}:`, chartData);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-300">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="date" stroke="#A0AEC0" />
          <YAxis stroke="#A0AEC0" />
          <Tooltip
            contentStyle={{ backgroundColor: '#2D3748', border: 'none' }}
            labelStyle={{ color: '#E2E8F0' }}
          />
          <Legend wrapperStyle={{ color: '#E2E8F0' }} />
          <Line type="monotone" dataKey="score" stroke="#63B3ED" strokeWidth={2} name="Test Score" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
