export interface TestSubmission {
  id: number;
  user_id: string;
  test_type: string;
  score: number;
  severity: string;
  answers: any;
  timestamp: string;
}

export interface MoodGrooveResult {
  id: number;
  user_id: string;
  dominant_mood: string;
  confidence: number;
  depression: number;
  anxiety: number;
  expressions: any;
  timestamp: string;
}

export interface BreathingExerciseLog {
    id: number;
    user_id: string;
    exercise_name: string;
    duration_seconds: number;
    timestamp: string;
}