'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { Loader2, ArrowRight, MessageSquare, BookUser, FileText, BrainCircuit, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import { useResults } from '@/context/ResultsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type SeverityLevel = {
    min: number;
    max: number;
    label: string;
};

const getSeverity = (score: number, levels: SeverityLevel[]) => {
  if (!levels || levels.length === 0) return 'Unknown';
  const level = levels.find(l => score >= l.min && score <= l.max);
  return level ? level.label : 'Unknown';
};

const getSeverityBadgeColor = (severity: string) => {
    const lowerSeverity = severity.toLowerCase();
    if (lowerSeverity.includes('severe') || lowerSeverity.includes('गंभीर')) {
        return 'bg-red-600/80 border-red-500 text-white';
    }
    if (lowerSeverity.includes('moderate') || lowerSeverity.includes('मध्यम')) {
        return 'bg-yellow-500/80 border-yellow-400 text-black';
    }
    if (lowerSeverity.includes('mild') || lowerSeverity.includes('minimal') || lowerSeverity.includes('हल्का') || lowerSeverity.includes('न्यूनतम')) {
        return 'bg-green-600/80 border-green-500 text-white';
    }
    return 'bg-gray-500/80 border-gray-400 text-white';
};

const ScoringLogicExplanation = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-gray-700">
        <AccordionTrigger className="text-white hover:no-underline">How is this scored?</AccordionTrigger>
        <AccordionContent>
          <p className="text-gray-400">
            Each answer has a value from 0 (Not at all) to 3 (Nearly every day). The total score is the sum of the values for all questions. This score is then used to determine the severity level (e.g., Minimal, Mild, Moderate, or Severe). This is a standard screening tool and not a formal diagnosis.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

function Suggestions({ testType, severityKey }: { testType: string, severityKey: string }) {
    const { t } = useTranslation('suggestions');
    const suggestions = t(`${testType.toLowerCase()}.${severityKey.toLowerCase()}`, { returnObjects: true }) as { title: string; summary: string; points: string[] };

    if (!suggestions || !suggestions.title) {
        return null;
    }

    return (
        <Card className="bg-gray-900/50 border-purple-500/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <BrainCircuit className="h-6 w-6 text-purple-400" />
                    {suggestions.title}
                </CardTitle>
                <CardDescription className="text-gray-400 pt-2">
                    {suggestions.summary}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
                {suggestions.points.map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                        <p className="text-sm">{point}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}


function ResultsDisplay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addResult } = useResults();
  const session = useSession();
  
  const testType = searchParams.get('testType');
  const scoreStr = searchParams.get('score');
  const lang = searchParams.get('lang');
  const score = scoreStr ? parseInt(scoreStr, 10) : null;
  const { t, i18n } = useTranslation(testType?.toLowerCase());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const newLang = lang || 'en';
    if (i18n.language !== newLang) {
        i18n.changeLanguage(newLang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    if (i18n.isInitialized && testType && i18n.hasResourceBundle(i18n.language, testType.toLowerCase())) {
        setIsReady(true);
    }
  }, [i18n.isInitialized, i18n.language, testType, i18n]);

  const { scoreRanges, severityLabels, title } = useMemo(() => {
    if (!isReady) return { scoreRanges: [], severityLabels: {}, title: 'Test' };
    return {
        scoreRanges: t('scoreRanges', { returnObjects: true }) as SeverityLevel[],
        severityLabels: t('severityLevels', { returnObjects: true }),
        title: t('title')
    };
  }, [t, isReady]);

  const severityKey = useMemo(() => {
    if (score === null) return 'Unknown';
    return getSeverity(score, scoreRanges);
  }, [score, scoreRanges]);

  const severityLabel = severityLabels[severityKey] || severityKey;

  useEffect(() => {
    if (testType && score !== null && severityKey !== 'Unknown' && session?.user?.id) {
      const answersStr = localStorage.getItem('screening_answers');
      if (answersStr) {
        const answers = JSON.parse(answersStr);
        const result = {
            userId: session.user.id,
            test_type: testType,
            score: score,
            severity: severityKey,
            answers: answers,
        };

        fetch('http://127.0.0.1:5001/api/test-submission', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result),
        }).catch(error => console.error("Failed to save test submission:", error));

        addResult(result);
        localStorage.removeItem('screening_answers');
      }
    }
  }, [testType, score, severityKey, addResult, session]);

  const handleDiscussWithAI = () => {
    // Add a small delay to ensure the Voiceflow API is ready
    setTimeout(() => {
        if (window.voiceflow?.chat?.setVariables) {
            window.voiceflow.chat.setVariables({
                user_score: score,
                test_type: testType,
            });
            window.voiceflow.chat.open();
        } else {
            alert('Chatbot is not available at the moment. Please try again in a few seconds.');
        }
    }, 100);
  };

  if (!isReady || score === null || !testType) {
    return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
        </div>
    );
  }

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-3xl mx-auto space-y-8"
    >
      <Card className="bg-gray-900/50 border-purple-500/20 text-center">
        <CardHeader>
          <CardTitle className="text-3xl text-white">Your {title} Result</CardTitle>
          <CardDescription className="text-gray-400">This is a snapshot, not a diagnosis. It can be a helpful starting point for a conversation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-gray-400">Your Score</p>
            <p className="text-8xl font-bold text-purple-400">{score}</p>
            <Badge className={cn("mt-2 text-xl py-1 px-4 border", getSeverityBadgeColor(severityLabel))}>
              {severityLabel}
            </Badge>
        </CardContent>
      </Card>
      
      

        <Suggestions testType={testType} severityKey={severityKey} />

        <ScoringLogicExplanation />

        <div className="text-center">
             <Button variant="outline" onClick={() => router.push('/self-check')}>Take Another Test</Button>
        </div>
    </motion.div>
  );
}

export default function ResultsPage() {
    return (
        <div className="container mx-auto py-24 sm:py-32">
            <Suspense fallback={
                <div className="flex justify-center items-center min-h-[50vh]">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
                </div>
            }>
                <ResultsDisplay />
            </Suspense>
        </div>
    )
}