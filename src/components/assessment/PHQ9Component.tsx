'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Brain, CheckCircle } from 'lucide-react';

interface PHQ9ComponentProps {
  onComplete: (data: { score: number; severity: string; answers: any[] }) => void;
  onNext: () => void;
}

const phq9Questions = [
  { id: 'phq9-1', text: 'Little interest or pleasure in doing things' },
  { id: 'phq9-2', text: 'Feeling down, depressed, or hopeless' },
  { id: 'phq9-3', text: 'Trouble falling or staying asleep, or sleeping too much' },
  { id: 'phq9-4', text: 'Feeling tired or having little energy' },
  { id: 'phq9-5', text: 'Poor appetite or overeating' },
  { id: 'phq9-6', text: 'Feeling bad about yourself or that you are a failure or have let yourself or your family down' },
  { id: 'phq9-7', text: 'Trouble concentrating on things, such as reading the newspaper or watching television' },
  { id: 'phq9-8', text: 'Moving or speaking so slowly that other people could have noticed, or the opposite being so fidgety or restless that you have been moving around a lot more than usual' },
  { id: 'phq9-9', text: 'Thoughts that you would be better off dead, or of hurting yourself' }
];

const responseOptions = [
  { value: '0', label: 'Not at all' },
  { value: '1', label: 'Several days' },
  { value: '2', label: 'More than half the days' },
  { value: '3', label: 'Nearly every day' }
];

const getSeverity = (score: number): string => {
  if (score <= 4) return 'None-Minimal';
  if (score <= 9) return 'Mild';
  if (score <= 14) return 'Moderate';
  if (score <= 19) return 'Moderately Severe';
  return 'Severe';
};

export default function PHQ9Component({ onComplete, onNext }: PHQ9ComponentProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const unanswered = phq9Questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions. ${unanswered.length} questions remaining.`);
      return;
    }

    setIsSubmitting(true);

    const answersArray = phq9Questions.map(question => ({
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
        <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">PHQ-9 Depression Screening</h3>
        <p className="text-gray-300">
          Over the last 2 weeks, how often have you been bothered by any of the following problems?
        </p>
      </div>

      {phq9Questions.map((question, index) => (
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
          disabled={phq9Questions.some(q => !answers[q.id]) || isSubmitting}
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
              Complete PHQ-9
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}