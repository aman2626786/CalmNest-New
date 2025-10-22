'use client';

import { useEffect } from 'react';
import { useResults } from '@/context/ResultsContext';
import { useMood } from '@/context/MoodContext';

declare global {
  interface Window {
    voiceflow?: {
      chat?: {
        setVariables: (variables: Record<string, any>) => void;
      };
    };
  }
}

export const VoiceflowContextUpdater = () => {
  const { results } = useResults();
  const { moodResult } = useMood();

  useEffect(() => {
    if (results.length > 0) {
      const lastResult = results[results.length - 1];
      if (window.voiceflow?.chat?.setVariables) {
        console.log('Updating Voiceflow with test result:', lastResult);
        window.voiceflow.chat.setVariables({
          lastTestType: lastResult.testType,
          lastTestScore: lastResult.score,
          lastTestSeverity: lastResult.severity,
        });
      }
    }
  }, [results]);

  useEffect(() => {
    if (moodResult) {
      if (window.voiceflow?.chat?.setVariables) {
        console.log('Updating Voiceflow with mood result:', moodResult);
        window.voiceflow.chat.setVariables({
          dominantMood: moodResult.dominantMood,
          depressionScore: moodResult.depression,
          anxietyScore: moodResult.anxiety,
        });
      }
    }
  }, [moodResult]);

  return null; // This component does not render anything
};
