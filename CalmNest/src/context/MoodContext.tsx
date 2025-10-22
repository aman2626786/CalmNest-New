'use client';

import { createContext, useState, ReactNode, useContext, Dispatch, SetStateAction } from 'react';

// Define the shape of the mood analysis result
export interface MoodResult {
  dominantMood: string;
  confidence: number;
  depression: number;
  anxiety: number;
  expressions: Record<string, number>;
}

// New interface for screening results
export interface ScreeningResult {
  testType: string;
  score: number;
  severity: string;
  guidance: {
    message: string;
    tips: string[];
  };
  answers: Record<string, string>;
  questions: { id: string; text: string }[];
  timestamp: string;
}

// Define the context shape
interface MoodContextType {
  moodResult: MoodResult | null;
  setMoodResult: Dispatch<SetStateAction<MoodResult | null>>;
  screeningResult: ScreeningResult | null;
  setScreeningResult: Dispatch<SetStateAction<ScreeningResult | null>>;
}

// Create the context with a default value
const MoodContext = createContext<MoodContextType | undefined>(undefined);

// Create the provider component
export const MoodProvider = ({ children }: { children: ReactNode }) => {
  const [moodResult, setMoodResult] = useState<MoodResult | null>(null);
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);

  return (
    <MoodContext.Provider value={{ moodResult, setMoodResult, screeningResult, setScreeningResult }}>
      {children}
    </MoodContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
