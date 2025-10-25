'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BarChart3, Loader2, Shield, Zap, Moon, Users } from 'lucide-react';

interface AdditionalAssessmentsComponentProps {
  onComplete: (data: {
    resilience: { score: number; answers: any[] };
    stress: { score: number; answers: any[] };
    sleep_quality: { score: number; answers: any[] };
    social_support: { score: number; answers: any[] };
  }) => void;
  onNext: () => void;
}

// Brief Resilience Scale (BRS) - 6 questions
const resilienceQuestions = [
  { id: "brs-1", text: "I tend to bounce back quickly after hard times" },
  { id: "brs-2", text: "I have a hard time making it through stressful events", reverse: true },
  { id: "brs-3", text: "It does not take me long to recover from a stressful event" },
  { id: "brs-4", text: "It is hard for me to snap back when something bad happens", reverse: true },
  { id: "brs-5", text: "I usually come through difficult times with little trouble" },
  { id: "brs-6", text: "I tend to take a long time to get over set-backs in my life", reverse: true }
];

// Perceived Stress Scale (PSS-4) - 4 questions
const stressQuestions = [
  { id: "pss-1", text: "In the last month, how often have you felt that you were unable to control the important things in your life?" },
  { id: "pss-2", text: "In the last month, how often have you felt confident about your ability to handle your personal problems?", reverse: true },
  { id: "pss-3", text: "In the last month, how often have you felt that things were going your way?", reverse: true },
  { id: "pss-4", text: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?" }
];

// Sleep Quality - 3 questions
const sleepQuestions = [
  { id: "sleep-1", text: "During the past month, how would you rate your sleep quality overall?" },
  { id: "sleep-2", text: "During the past month, how often have you had trouble sleeping because you cannot get to sleep within 30 minutes?" },
  { id: "sleep-3", text: "During the past month, how often have you had trouble sleeping because you wake up in the middle of the night or early morning?" }
];

// Social Support - 3 questions
const socialSupportQuestions = [
  { id: "social-1", text: "There is a special person who is around when I am in need" },
  { id: "social-2", text: "I have a special person who is a real source of comfort to me" },
  { id: "social-3", text: "My friends really try to help me" }
];

const resilienceOptions = {
  "1": "Strongly Disagree",
  "2": "Disagree", 
  "3": "Neutral",
  "4": "Agree",
  "5": "Strongly Agree"
};

const stressOptions = {
  "0": "Never",
  "1": "Almost Never",
  "2": "Sometimes",
  "3": "Fairly Often",
  "4": "Very Often"
};

const sleepOptions = {
  "0": "Very Good",
  "1": "Fairly Good",
  "2": "Fairly Bad",
  "3": "Very Bad"
};

const socialOptions = {
  "1": "Very Strongly Disagree",
  "2": "Strongly Disagree",
  "3": "Mildly Disagree",
  "4": "Neutral",
  "5": "Mildly Agree",
  "6": "Strongly Agree",
  "7": "Very Strongly Agree"
};

export default function AdditionalAssessmentsComponent({ onComplete, onNext }: AdditionalAssessmentsComponentProps) {
  const { t, i18n } = useTranslation('additional-assessments');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Get questions and options from translation
  const resilienceQuestions = useMemo(() => {
    if (!isReady) return [];
    const questionData = t('resilience.questions', { returnObjects: true });
    return Array.isArray(questionData) ? questionData : [];
  }, [t, isReady]);

  const stressQuestions = useMemo(() => {
    if (!isReady) return [];
    const questionData = t('stress.questions', { returnObjects: true });
    return Array.isArray(questionData) ? questionData : [];
  }, [t, isReady]);

  const sleepQuestions = useMemo(() => {
    if (!isReady) return [];
    const questionData = t('sleep.questions', { returnObjects: true });
    return Array.isArray(questionData) ? questionData : [];
  }, [t, isReady]);

  const socialQuestions = useMemo(() => {
    if (!isReady) return [];
    const questionData = t('social.questions', { returnObjects: true });
    return Array.isArray(questionData) ? questionData : [];
  }, [t, isReady]);

  const resilienceOptions = useMemo(() => {
    if (!isReady) return {};
    return t('resilience.options', { returnObjects: true });
  }, [t, isReady]);

  const stressOptions = useMemo(() => {
    if (!isReady) return {};
    return t('stress.options', { returnObjects: true });
  }, [t, isReady]);

  const sleepOptions = useMemo(() => {
    if (!isReady) return {};
    return t('sleep.options', { returnObjects: true });
  }, [t, isReady]);

  const socialOptions = useMemo(() => {
    if (!isReady) return {};
    return t('social.options', { returnObjects: true });
  }, [t, isReady]);

  useEffect(() => {
    if (i18n.isInitialized && i18n.hasResourceBundle(i18n.language, 'additional-assessments')) {
      setIsReady(true);
    }
  }, [i18n.isInitialized, i18n.language, i18n]);

  const formSchema = useMemo(() => {
    if (!isReady || resilienceQuestions.length === 0) {
      return z.object({});
    }
    return z.object({
      // Resilience questions
      ...Object.fromEntries(resilienceQuestions.map((q: any) => [q.id, z.string().nonempty('Please select an answer.')])),
      // Stress questions
      ...Object.fromEntries(stressQuestions.map((q: any) => [q.id, z.string().nonempty('Please select an answer.')])),
      // Sleep questions
      ...Object.fromEntries(sleepQuestions.map((q: any) => [q.id, z.string().nonempty('Please select an answer.')])),
      // Social support questions
      ...Object.fromEntries(socialQuestions.map((q: any) => [q.id, z.string().nonempty('Please select an answer.')]))
    });
  }, [isReady, resilienceQuestions, stressQuestions, sleepQuestions, socialQuestions]);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const calculateScores = (data: FormValues) => {
    // Calculate Resilience Score (BRS)
    const resilienceAnswers = resilienceQuestions.map((q: any) => {
      const value = parseInt(data[q.id as keyof FormValues], 10);
      const score = q.reverse ? (6 - value) : value; // Reverse scoring for negative items
      return {
        question: q.text,
        option: resilienceOptions[data[q.id as keyof FormValues] as keyof typeof resilienceOptions],
        score
      };
    });
    const resilienceScore = resilienceAnswers.reduce((sum, answer) => sum + answer.score, 0);

    // Calculate Stress Score (PSS-4)
    const stressAnswers = stressQuestions.map((q: any) => {
      const value = parseInt(data[q.id as keyof FormValues], 10);
      const score = q.reverse ? (4 - value) : value; // Reverse scoring for positive items
      return {
        question: q.text,
        option: stressOptions[data[q.id as keyof FormValues] as keyof typeof stressOptions],
        score
      };
    });
    const stressScore = stressAnswers.reduce((sum, answer) => sum + answer.score, 0);

    // Calculate Sleep Quality Score
    const sleepAnswers = sleepQuestions.map((q: any) => {
      const value = parseInt(data[q.id as keyof FormValues], 10);
      return {
        question: q.text,
        option: sleepOptions[data[q.id as keyof FormValues] as keyof typeof sleepOptions],
        score: value
      };
    });
    const sleepScore = sleepAnswers.reduce((sum, answer) => sum + answer.score, 0);

    // Calculate Social Support Score
    const socialAnswers = socialQuestions.map((q: any) => {
      const value = parseInt(data[q.id as keyof FormValues], 10);
      return {
        question: q.text,
        option: socialOptions[data[q.id as keyof FormValues] as keyof typeof socialOptions],
        score: value
      };
    });
    const socialScore = socialAnswers.reduce((sum, answer) => sum + answer.score, 0);

    return {
      resilience: { score: resilienceScore, answers: resilienceAnswers },
      stress: { score: stressScore, answers: stressAnswers },
      sleep_quality: { score: sleepScore, answers: sleepAnswers },
      social_support: { score: socialScore, answers: socialAnswers }
    };
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const scores = calculateScores(data);
      
      // Call the completion handler
      onComplete(scores);
      
      // Small delay for user feedback
      setTimeout(() => {
        onNext();
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting additional assessments:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady || resilienceQuestions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            {t('title', 'Additional Wellness Assessments')}
          </CardTitle>
          <CardDescription>
            {t('description', 'Brief assessments to understand your resilience, stress levels, sleep quality, and social support.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Resilience Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Brief Resilience Scale</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Please indicate how much you agree or disagree with each statement.
                </p>
                
                {resilienceQuestions.map((question, index) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name={question.id as any}
                    render={({ field }) => (
                      <FormItem className="space-y-3 p-4 rounded-lg border border-gray-600/50 bg-gray-700/20">
                        <FormLabel className="text-sm text-white font-medium">
                          {index + 1}. {question.text}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-5 gap-2"
                          >
                            {Object.entries(resilienceOptions).map(([value, label]) => (
                              <FormItem key={value} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem 
                                    value={value} 
                                    id={`${field.name}-${value}`} 
                                    className="text-green-400 border-gray-500" 
                                  />
                                </FormControl>
                                <FormLabel 
                                  htmlFor={`${field.name}-${value}`} 
                                  className="text-xs text-gray-300 cursor-pointer"
                                >
                                  {label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* Stress Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-white">Perceived Stress Scale</h3>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  The questions ask about your feelings and thoughts during the last month.
                </p>
                
                {stressQuestions.map((question, index) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name={question.id as any}
                    render={({ field }) => (
                      <FormItem className="space-y-3 p-4 rounded-lg border border-gray-600/50 bg-gray-700/20">
                        <FormLabel className="text-sm text-white font-medium">
                          {index + 1}. {question.text}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-5 gap-2"
                          >
                            {Object.entries(stressOptions).map(([value, label]) => (
                              <FormItem key={value} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem 
                                    value={value} 
                                    id={`${field.name}-${value}`} 
                                    className="text-red-400 border-gray-500" 
                                  />
                                </FormControl>
                                <FormLabel 
                                  htmlFor={`${field.name}-${value}`} 
                                  className="text-xs text-gray-300 cursor-pointer"
                                >
                                  {label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* Sleep Quality Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Moon className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Sleep Quality Assessment</h3>
                </div>
                
                {sleepQuestions.map((question, index) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name={question.id as any}
                    render={({ field }) => (
                      <FormItem className="space-y-3 p-4 rounded-lg border border-gray-600/50 bg-gray-700/20">
                        <FormLabel className="text-sm text-white font-medium">
                          {index + 1}. {question.text}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-4 gap-2"
                          >
                            {Object.entries(sleepOptions).map(([value, label]) => (
                              <FormItem key={value} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem 
                                    value={value} 
                                    id={`${field.name}-${value}`} 
                                    className="text-blue-400 border-gray-500" 
                                  />
                                </FormControl>
                                <FormLabel 
                                  htmlFor={`${field.name}-${value}`} 
                                  className="text-xs text-gray-300 cursor-pointer"
                                >
                                  {label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* Social Support Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Social Support Assessment</h3>
                </div>
                
                {socialSupportQuestions.map((question, index) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name={question.id as any}
                    render={({ field }) => (
                      <FormItem className="space-y-3 p-4 rounded-lg border border-gray-600/50 bg-gray-700/20">
                        <FormLabel className="text-sm text-white font-medium">
                          {index + 1}. {question.text}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-7 gap-1"
                          >
                            {Object.entries(socialOptions).map(([value, label]) => (
                              <FormItem key={value} className="flex items-center space-x-1 space-y-0">
                                <FormControl>
                                  <RadioGroupItem 
                                    value={value} 
                                    id={`${field.name}-${value}`} 
                                    className="text-purple-400 border-gray-500" 
                                  />
                                </FormControl>
                                <FormLabel 
                                  htmlFor={`${field.name}-${value}`} 
                                  className="text-xs text-gray-300 cursor-pointer"
                                >
                                  {label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              
              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Results...
                    </>
                  ) : (
                    'Complete Additional Assessments'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}