'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Shield, Zap, Moon, Users, CheckCircle } from 'lucide-react';

interface AdditionalAssessmentsComponentProps {
  onComplete: (data: {
    resilience: { score: number; answers: any[] };
    stress: { score: number; answers: any[] };
    sleep_quality: { score: number; answers: any[] };
    social_support: { score: number; answers: any[] };
  }) => void;
  onNext: () => void;
}

// Simplified questions for quick assessment
const assessmentQuestions = [
  {
    id: 'resilience',
    title: 'Resilience',
    icon: Shield,
    color: 'text-green-400',
    question: 'How well do you bounce back from difficult situations?',
    options: [
      { value: '1', label: 'Very poorly - I struggle to recover' },
      { value: '2', label: 'Poorly - It takes me a long time' },
      { value: '3', label: 'Moderately - I eventually get through it' },
      { value: '4', label: 'Well - I recover fairly quickly' },
      { value: '5', label: 'Very well - I bounce back quickly' }
    ]
  },
  {
    id: 'stress',
    title: 'Stress Level',
    icon: Zap,
    color: 'text-yellow-400',
    question: 'How often do you feel overwhelmed by stress in your daily life?',
    options: [
      { value: '1', label: 'Never - I feel very calm' },
      { value: '2', label: 'Rarely - Only occasionally stressed' },
      { value: '3', label: 'Sometimes - Moderate stress levels' },
      { value: '4', label: 'Often - Frequently feel stressed' },
      { value: '5', label: 'Always - Constantly overwhelmed' }
    ]
  },
  {
    id: 'sleep_quality',
    title: 'Sleep Quality',
    icon: Moon,
    color: 'text-blue-400',
    question: 'How would you rate your overall sleep quality?',
    options: [
      { value: '5', label: 'Excellent - I sleep very well' },
      { value: '4', label: 'Good - Generally sleep well' },
      { value: '3', label: 'Fair - Some sleep issues' },
      { value: '2', label: 'Poor - Often have trouble sleeping' },
      { value: '1', label: 'Very poor - Severe sleep problems' }
    ]
  },
  {
    id: 'social_support',
    title: 'Social Support',
    icon: Users,
    color: 'text-purple-400',
    question: 'How supported do you feel by friends and family?',
    options: [
      { value: '5', label: 'Very supported - Strong support network' },
      { value: '4', label: 'Supported - Good friends and family' },
      { value: '3', label: 'Moderately supported - Some support' },
      { value: '2', label: 'Poorly supported - Limited support' },
      { value: '1', label: 'Not supported - Feel alone' }
    ]
  }
];

export default function AdditionalAssessmentsComponent({ onComplete, onNext }: AdditionalAssessmentsComponentProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    const unanswered = assessmentQuestions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions. Missing: ${unanswered.map(q => q.title).join(', ')}`);
      return;
    }

    setIsSubmitting(true);

    // Calculate scores and prepare results
    const results = {
      resilience: {
        score: parseInt(answers.resilience),
        answers: [{ question: 'Resilience assessment', answer: answers.resilience }]
      },
      stress: {
        score: parseInt(answers.stress),
        answers: [{ question: 'Stress level assessment', answer: answers.stress }]
      },
      sleep_quality: {
        score: parseInt(answers.sleep_quality),
        answers: [{ question: 'Sleep quality assessment', answer: answers.sleep_quality }]
      },
      social_support: {
        score: parseInt(answers.social_support),
        answers: [{ question: 'Social support assessment', answer: answers.social_support }]
      }
    };

    setTimeout(() => {
      onComplete(results);
      onNext();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Additional Wellness Assessment</h3>
        <p className="text-gray-300">
          Please answer these questions about your resilience, stress, sleep, and social support.
        </p>
      </div>

      {assessmentQuestions.map((assessment) => {
        const Icon = assessment.icon;
        return (
          <Card key={assessment.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Icon className={`w-6 h-6 ${assessment.color}`} />
                {assessment.title}
              </CardTitle>
              <CardDescription>{assessment.question}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={answers[assessment.id] || ''} 
                onValueChange={(value) => handleAnswerChange(assessment.id, value)}
              >
                {assessment.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${assessment.id}-${option.value}`} />
                    <Label 
                      htmlFor={`${assessment.id}-${option.value}`} 
                      className="text-gray-300 cursor-pointer text-sm"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        );
      })}

      <div className="text-center">
        <Button
          onClick={handleSubmit}
          disabled={assessmentQuestions.some(q => !answers[q.id]) || isSubmitting}
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
              Complete Assessment
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}