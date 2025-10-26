'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

interface Question {
  id: string;
  text: string;
}

export default function TestClientPage() {
    const router = useRouter();
    const params = useParams();
    const test = params.test as string; // 'phq9' or 'gad7'

    const { t, i18n } = useTranslation(test);
    const [isReady, setIsReady] = useState(false);

    // This effect ensures that the translation file is loaded before we render the form.
    useEffect(() => {
        const loadTranslations = async () => {
            console.log('Loading translations for test:', test);
            console.log('i18n initialized:', i18n.isInitialized);
            console.log('Current language:', i18n.language);
            
            // Try to load the translation file if not already loaded
            if (!i18n.hasResourceBundle(i18n.language, test)) {
                try {
                    const response = await fetch(`/locales/${i18n.language}/${test}.json`);
                    if (response.ok) {
                        const translations = await response.json();
                        i18n.addResourceBundle(i18n.language, test, translations, true, true);
                        console.log(`✅ Loaded ${test} translations:`, translations);
                    } else {
                        console.error(`❌ Failed to load ${test} translations:`, response.status);
                    }
                } catch (error) {
                    console.error(`❌ Error loading ${test} translations:`, error);
                }
            }
            
            if (i18n.isInitialized && i18n.hasResourceBundle(i18n.language, test)) {
                console.log('✅ Translations ready for:', test);
                setIsReady(true);
            } else {
                console.warn('⚠️ Translations not ready for:', test);
                // Set ready anyway after a timeout to prevent infinite loading
                setTimeout(() => setIsReady(true), 2000);
            }
        };

        loadTranslations();
    }, [i18n.isInitialized, i18n.language, test, i18n]);

    const questions: Question[] = useMemo(() => {
        if (!isReady) return [];
        
        try {
            const questionData = t('questions', { returnObjects: true });
            if (Array.isArray(questionData) && questionData.length > 0) {
                return questionData;
            }
        } catch (error) {
            console.warn('Error getting questions from translations:', error);
        }
        
        // Fallback questions if translations fail
        if (test === 'phq9') {
            return [
                { "id": "phq9-1", "text": "Little interest or pleasure in doing things" },
                { "id": "phq9-2", "text": "Feeling down, depressed, or hopeless" },
                { "id": "phq9-3", "text": "Trouble falling or staying asleep, or sleeping too much" },
                { "id": "phq9-4", "text": "Feeling tired or having little energy" },
                { "id": "phq9-5", "text": "Poor appetite or overeating" },
                { "id": "phq9-6", "text": "Feeling bad about yourself — or that you are a failure or have let yourself or your family down" },
                { "id": "phq9-7", "text": "Trouble concentrating on things, such as reading the newspaper or watching television" },
                { "id": "phq9-8", "text": "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual" },
                { "id": "phq9-9", "text": "Thoughts that you would be better off dead, or of hurting yourself" }
            ];
        } else if (test === 'gad7') {
            return [
                { "id": "gad7-1", "text": "Feeling nervous, anxious, or on edge" },
                { "id": "gad7-2", "text": "Not being able to stop or control worrying" },
                { "id": "gad7-3", "text": "Worrying too much about different things" },
                { "id": "gad7-4", "text": "Trouble relaxing" },
                { "id": "gad7-5", "text": "Being so restless that it is hard to sit still" },
                { "id": "gad7-6", "text": "Becoming easily annoyed or irritable" },
                { "id": "gad7-7", "text": "Feeling afraid, as if something awful might happen" }
            ];
        }
        
        return [];
    }, [t, isReady, test]);

    const options = useMemo(() => {
        if (!isReady) return {};
        
        try {
            const optionData = t('options', { returnObjects: true });
            if (optionData && typeof optionData === 'object') {
                return optionData;
            }
        } catch (error) {
            console.warn('Error getting options from translations:', error);
        }
        
        // Fallback options
        return {
            "0": "Not at all",
            "1": "Several days", 
            "2": "More than half the days",
            "3": "Nearly every day"
        };
    }, [t, isReady]);
    
    const formSchema = useMemo(() => {
        if (questions.length === 0) {
            return z.object({}); // Return an empty schema if questions are not loaded
        }
        const schemaShape = Object.fromEntries(
            questions.map((q) => [q.id, z.string().nonempty('Please select an answer.')])
        );
        return z.object(schemaShape);
    }, [questions]);

    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (data: FormValues) => {
        const answers = Object.entries(data).map(([key, value]) => {
            const question = questions.find(q => q.id === key);
            const option = options[value];
            return {
                question: question ? question.text : '',
                option: option || '',
                score: parseInt(value, 10),
            };
        });
        const score = answers.reduce((sum, answer) => sum + answer.score, 0);

        localStorage.setItem('screening_answers', JSON.stringify(answers));
        
        const urlParams = new URLSearchParams({
            testType: test.toUpperCase(),
            score: score.toString(),
            lang: i18n.language,
        });
        router.push(`/self-check/results?${urlParams.toString()}`);
    };

    if (!isReady || questions.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
            </div>
        );
    }

  return (
    <div className="container mx-auto py-24 sm:py-32 max-w-2xl">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
        <Card className="bg-gray-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              {t('title') || (test === 'phq9' ? 'PHQ-9 Depression Screening' : 'GAD-7 Anxiety Screening')}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {t('description') || 'Over the last 2 weeks, how often have you been bothered by any of the following problems?'}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-8">
                {questions.map((question, index) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name={question.id as any}
                    render={({ field }) => (
                      <FormItem className="space-y-3 p-4 rounded-lg border border-gray-700/50 bg-gray-900">
                        <FormLabel className="text-base text-white">{index + 1}. {question.text}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2 pt-2"
                          >
                            {Object.entries(options).map(([value, label]) => (
                               <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={value} id={`${field.name}-${value}`} className="text-purple-400 border-gray-600 focus:ring-purple-500" />
                                </FormControl>
                                <FormLabel htmlFor={`${field.name}-${value}`} className="font-normal text-gray-300">
                                  {label as string}
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
              </CardContent>
              <CardFooter>
                 <Button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Get My Results
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        </motion.div>
    </div>
  );
}