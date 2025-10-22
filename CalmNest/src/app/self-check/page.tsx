'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Frown, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

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
    </div>
  );
}
