'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Heart, CheckCircle } from 'lucide-react';

interface GAD7ComponentProps {
  onComplete: (data: { score: number; severity: string; answers: any[] }) => void;
  onNext: () => void;
}

const gad7Questions = [
  { id: 'gad7-1', text: 'Feeling nervous, anxious, or on edge' },
  { id: 'gad7-2', text: 'Not being able to stop or control worrying' },
  { id: 'gad7-3', text: 'Worrying too much about different things' },
  { id: 'gad7-4', text: 'Trouble relaxing' },
  { id: 'gad7-5', text: 'Being so restless that it is hard to sit still' },
  { id: 'gad7-6', text: 'Becoming easily annoyed or irritable' },
  { id: 'gad7-7', text: 'Feeling afraid, as if something awful might happen' }
];

const responseOptions = [
  { value: '0', label: 'Not at all' },
  { value: '1', label: 'Several days' },
  { value: '2', label: 'More than half the days' },
  { value: '3', label: 'Nearly every day' }
];

const getSeverity = (score: number): string => {
  if (score <= 4) return 'Minimal Anxiety';
  if (score <= 9) return 'Mild Anxiety';
  if (score <= 14) return 'Moderate Anxiety';
  return 'Severe Anxiety';
};

export default function GAD7Component({ onComplete, onNext }: GAD7ComponentProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const unanswered = gad7Questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions. ${unanswered.length} questions remaining.`);
      return;
    }

    setIsSubmitting(true);

    const answersArray = gad7Questions.map(question => ({
      question: question.text,
      option: responseOptions.find(opt => opt.value === answers[question.id])?.label || '',
      score: parseInt(answers[question.id], 10)
    }));

    const score = answersArray.reduce((sum, answer) => sum + answer.score, 0);
    const severity = getSeverity(score);

    setTimeout(() => {
      onComplete({ score, severity, answers: answersArray });
      onNext();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">GAD-7 Anxiety Assessment</h3>
        <p className="text-gray-300">
          Over the last 2 weeks, how often have you been bothered by the following problems?
        </p>
      </div>

      {gad7Questions.map((question, index) => (
        <Card key={question.id} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-base">
              {index + 1}. {question.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[question.id] || ''} 
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              {responseOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                  <Label 
                    htmlFor={`${question.id}-${option.value}`} 
                    className="text-gray-300 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      <div className="text-center">
        <Button
          onClick={handleSubmit}
          disabled={gad7Questions.some(q => !answers[q.id]) || isSubmitting}
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
              Complete GAD-7
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}