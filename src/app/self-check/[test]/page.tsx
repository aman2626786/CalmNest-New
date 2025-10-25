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

export default function TestPage() {
    const router = useRouter();
    const params = useParams();
    const test = params.test as string; // 'phq9' or 'gad7'

    const { t, i18n } = useTranslation(test);
    const [isReady, setIsReady] = useState(false);

    // This effect ensures that the translation file is loaded before we render the form.
    useEffect(() => {
        if (i18n.isInitialized && i18n.hasResourceBundle(i18n.language, test)) {
            setIsReady(true);
        }
    }, [i18n.isInitialized, i18n.language, test, i18n]);

    const questions: Question[] = useMemo(() => {
        if (!isReady) return [];
        const questionData = t('questions', { returnObjects: true });
        return Array.isArray(questionData) ? questionData : [];
    }, [t, isReady]);

    const options = useMemo(() => {
        if (!isReady) return {};
        return t('options', { returnObjects: true });
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
            <CardTitle className="text-white text-2xl">{t('title')}</CardTitle>
            <CardDescription className="text-gray-400">{t('description')}</CardDescription>
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

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Return empty array for static export - pages will be generated on demand
  return [];
}
