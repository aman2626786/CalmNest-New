'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { HTMLAttributes } from 'react';

interface ScoringLogicExplanationProps extends HTMLAttributes<HTMLDivElement> {}

export function ScoringLogicExplanation({ className, ...props }: ScoringLogicExplanationProps) {
  return (
    <Card className="bg-gray-900/50 border-purple-500/20" {...props}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="h-6 w-6 text-purple-400" />
          How Scores Are Calculated
        </CardTitle>
        <CardDescription className="text-gray-400">
          Understanding the analysis behind your results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-gray-300">
        <div>
          <h3 className="font-semibold mb-2">Emotion Detection</h3>
          <p className="text-sm">
            We use face-api.js to analyze facial expressions in real-time. The model detects seven basic emotions:
            happy, sad, angry, fearful, disgusted, surprised, and neutral. Each emotion is given a confidence score
            between 0-100%.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Depression Indicators</h3>
          <p className="text-sm">
            Depression score is calculated by analyzing:
          </p>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            <li>Frequency and intensity of detected sadness (contributes up to 20%)</li>
            <li>Absence of positive emotions like happiness (contributes up to 15%)</li>
            <li>Scores are smoothed over time to reduce momentary fluctuations</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Anxiety Indicators</h3>
          <p className="text-sm">
            Anxiety score is calculated by analyzing:
          </p>
          <ul className="list-disc list-inside text-sm mt-1 space-y-1">
            <li>Frequency and intensity of fear expressions (contributes up to 25%)</li>
            <li>Frequency of surprise expressions (contributes up to 15%)</li>
            <li>Scores are smoothed over time using weighted averaging</li>
          </ul>
        </div>

        <div className="text-sm bg-gray-800/50 p-4 rounded-lg mt-4">
          <p className="font-medium text-yellow-400 mb-2">Important Note:</p>
          <p>
            These scores are approximations based on visual cues only and should not be considered as clinical
            diagnoses. For accurate assessment, please consult with mental health professionals who can evaluate
            multiple factors beyond facial expressions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
