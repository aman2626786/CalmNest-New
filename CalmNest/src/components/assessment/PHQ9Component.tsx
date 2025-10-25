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
import { Brain, Loader2 } from 'lucide-react';

interface PHQ9ComponentProps {
  onComplete: (data: { score: number; severity: string; answers: any[] }) => void;
  onNext: () => void;
}

const getSeverity = (score: number, t: any): string => {
  if (score <= 4) return t('severityLevels.none_minimal', 'None-Minimal');
  if (score <= 9) return t('severityLevels.mild', 'Mild');
  if (score <= 14) return t('severityLevels.moderate', 'Moderate');
  if (score <= 19) return t('severityLevels.moderately_severe', 'Moderately Severe');
  return t('severityLevels.severe', 'Severe');
};

export default function PHQ9Component({ onComplete, onNext }: PHQ9ComponentProps) {
  const { t, i18n } = useTranslation('phq9');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Get questions and options from translation
  const questions = useMemo(() => {
    if (!isReady) return [];
    const questionData = t('questions', { returnObjects: true });
    return Array.isArray(questionData) ? questionData : [];
  }, [t, isReady]);

  const options = useMemo(() => {
    if (!isReady) return {};
    return t('options', { returnObjects: true });
  }, [t, isReady]);

  useEffect(() => {
    if (i18n.isInitialized && i18n.hasResourceBundle(i18n.language, 'phq9')) {
      setIsReady(true);
    }
  }, [i18n.isInitialized, i18n.language, i18n]);

  const formSchema = useMemo(() => {
    if (questions.length === 0) {
      return z.object({});
    }
    const schemaShape = Object.fromEntries(
      questions.map((q: any) => [q.id, z.string().nonempty('Please select an answer.')])
    );
    return z.object(schemaShape);
  }, [questions]);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const answers = Object.entries(data).map(([key, value]) => {
        const question = questions.find((q: any) => q.id === key);
        const option = options[value as keyof typeof options];
        return {
          question: question ? question.text : '',
          option: option || '',
          score: parseInt(value, 10),
        };
      });
      
      const score = answers.reduce((sum, answer) => sum + answer.score, 0);
      const severity = getSeverity(score, t);

      // Call the completion handler
      onComplete({ score, severity, answers });
      
      // Small delay for user feedback
      setTimeout(() => {
        onNext();
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting PHQ-9:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady || questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Brain className="w-6 h-6 text-purple-400" />
            {t('title', 'PHQ-9 Depression Screening')}
          </CardTitle>
          <CardDescription>
            {t('description', 'Over the last 2 weeks, how often have you been bothered by any of the following problems?')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {questions.map((question: any, index: number) => (
                <FormField
                  key={question.id}
                  control={form.control}
                  name={question.id as any}
                  render={({ field }) => (
                    <FormItem className="space-y-3 p-4 rounded-lg border border-gray-600/50 bg-gray-700/30">
                      <FormLabel className="text-base text-white font-medium">
                        {index + 1}. {question.text}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2 pt-2"
                        >
                          {Object.entries(options).map(([value, label]) => (
                            <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem 
                                  value={value} 
                                  id={`${field.name}-${value}`} 
                                  className="text-purple-400 border-gray-500 focus:ring-purple-500" 
                                />
                              </FormControl>
                              <FormLabel 
                                htmlFor={`${field.name}-${value}`} 
                                className="font-normal text-gray-300 cursor-pointer"
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
              
              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Results...
                    </>
                  ) : (
                    t('completeButton', 'Complete PHQ-9 Assessment')
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