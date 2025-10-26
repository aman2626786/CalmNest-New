'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Camera, CheckCircle, Heart } from 'lucide-react';

interface MoodGroveComponentProps {
  onComplete: (data: { 
    dominantMood: string; 
    confidence: number; 
    depression: number; 
    anxiety: number; 
    expressions: any 
  }) => void;
  onNext: () => void;
}

const moodOptions = [
  { value: 'happy', label: 'Happy 😊', depression: 1, anxiety: 1 },
  { value: 'content', label: 'Content 😌', depression: 2, anxiety: 2 },
  { value: 'neutral', label: 'Neutral 😐', depression: 3, anxiety: 3 },
  { value: 'sad', label: 'Sad 🙁', depression: 6, anxiety: 4 },
  { value: 'anxious', label: 'Anxious 😰', depression: 4, anxiety: 7 },
  { value: 'angry', label: 'Angry 😠', depression: 5, anxiety: 5 },
  { value: 'stressed', label: 'Stressed 😫', depression: 5, anxiety: 8 }
];

const intensityOptions = [
  { value: '1', label: 'Very Mild' },
  { value: '2', label: 'Mild' },
  { value: '3', label: 'Moderate' },
  { value: '4', label: 'Strong' },
  { value: '5', label: 'Very Strong' }
];

export default function MoodGroveComponent({ onComplete, onNext }: MoodGroveComponentProps) {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedIntensity, setSelectedIntensity] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!selectedMood || !selectedIntensity) {
      alert('Please select both your current mood and its intensity.');
      return;
    }

    setIsSubmitting(true);

    const moodData = moodOptions.find(m => m.value === selectedMood);
    const intensity = parseInt(selectedIntensity);
    
    // Calculate scores based on mood and intensity
    const baseDepression = moodData?.depression || 3;
    const baseAnxiety = moodData?.anxiety || 3;
    
    const adjustedDepression = Math.min(10, baseDepression + (intensity - 3));
    const adjustedAnxiety = Math.min(10, baseAnxiety + (intensity - 3));

    const result = {
      dominantMood: selectedMood,
      confidence: 0.85, // Simulated confidence
      depression: adjustedDepression,
      anxiety: adjustedAnxiety,
      expressions: {
        [selectedMood]: intensity * 0.2,
        intensity: intensity
      }
    };

    setTimeout(() => {
      onComplete(result);
      onNext();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Mood Analysis</h3>
        <p className="text-gray-300">
          Please select your current mood and how intensely you're feeling it.
        </p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Current Mood</CardTitle>
          <CardDescription>How are you feeling right now?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={selectedMood} onValueChange={setSelectedMood}>
            {moodOptions.map((mood) => (
              <div key={mood.value} className="flex items-center space-x-2">
                <RadioGroupItem value={mood.value} id={mood.value} />
                <Label htmlFor={mood.value} className="text-gray-300 cursor-pointer">
                  {mood.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {selectedMood && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Intensity Level</CardTitle>
            <CardDescription>How strongly are you feeling this mood?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={selectedIntensity} onValueChange={setSelectedIntensity}>
              {intensityOptions.map((intensity) => (
                <div key={intensity.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={intensity.value} id={`intensity-${intensity.value}`} />
                  <Label htmlFor={`intensity-${intensity.value}`} className="text-gray-300 cursor-pointer">
                    {intensity.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <Button
          onClick={handleSubmit}
          disabled={!selectedMood || !selectedIntensity || isSubmitting}
          className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Complete Mood Analysis
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}