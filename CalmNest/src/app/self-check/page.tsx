'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Frown, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FAQ } from '@/components/common/FAQ';

export default function SelfCheckPage() {
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto max-w-4xl py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">{t('selfCheck.title')}</h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">{t('selfCheck.description')}</p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="flex flex-col text-center bg-gray-900/50 border-purple-500/20 hover:border-purple-500/60 transition-all duration-300">
            <CardHeader className="items-center">
              <Frown className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-2xl text-white">{t('selfCheck.phq9Title')}</CardTitle>
              <CardDescription className="pt-2 text-gray-400">{t('selfCheck.phq9Description')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Link href="/self-check/phq9">{t('selfCheck.startTest')} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="flex flex-col text-center bg-gray-900/50 border-purple-500/20 hover:border-purple-500/60 transition-all duration-300">
            <CardHeader className="items-center">
              <AlertTriangle className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-2xl text-white">{t('selfCheck.gad7Title')}</CardTitle>
              <CardDescription className="pt-2 text-gray-400">{t('selfCheck.gad7Description')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Link href="/self-check/gad7">{t('selfCheck.startTest')} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <FAQ 
        title="Self-Assessment FAQ"
        faqs={[
          {
            question: "What is the difference between PHQ-9 and GAD-7?",
            answer: "PHQ-9 (Patient Health Questionnaire-9) screens for depression symptoms, while GAD-7 (Generalized Anxiety Disorder-7) screens for anxiety symptoms. Both are clinically validated tools used by healthcare professionals."
          },
          {
            question: "How long do these assessments take?",
            answer: "Each assessment takes about 2-3 minutes to complete. PHQ-9 has 9 questions and GAD-7 has 7 questions, all with simple multiple-choice answers."
          },
          {
            question: "Are my results confidential?",
            answer: "Yes, your assessment results are completely confidential and stored securely. Only you can access your results through your personal dashboard."
          },
          {
            question: "Should I take both assessments?",
            answer: "We recommend taking both assessments as depression and anxiety often co-occur. This gives you a more complete picture of your mental health status."
          },
          {
            question: "What should I do with my results?",
            answer: "Use your results to track your mental health over time. If you score high on either assessment, consider speaking with a mental health professional. These tools are for screening purposes and don't replace professional diagnosis."
          },
          {
            question: "How often should I retake these assessments?",
            answer: "You can retake assessments weekly or whenever you feel your mental health status has changed. Regular monitoring helps track your progress and identify patterns."
          }
        ]}
        className="mt-16"
      />
    </div>
  );
}
