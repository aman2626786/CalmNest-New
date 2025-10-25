'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useTranslationReady } from '@/hooks/useTranslationReady';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Users, ArrowRight, Play, Star, Activity, CheckCircle } from 'lucide-react';

export const Hero = () => {
  const { t } = useTranslation('common');
  const [isClient, setIsClient] = useState(false);
  const { isReady } = useTranslationReady('common');

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-purple-900/30 to-indigo-900/20" />

      {/* Floating Elements */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Loading State - Only show on client when translations aren't ready */}
      {isClient && !isReady && (
        <div className="container-custom relative z-10 px-4">
          <div className="text-center max-w-6xl mx-auto pt-20">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-8 mx-auto w-64"></div>
              <div className="h-20 bg-gray-700 rounded mb-8 mx-auto w-96"></div>
              <div className="h-6 bg-gray-700 rounded mb-12 mx-auto w-80"></div>
              <div className="h-16 bg-gray-700 rounded mb-8 mx-auto w-72"></div>
            </div>
          </div>
        </div>
      )}

      {/* Content - Render during SSG and when ready on client */}
      {(!isClient || isReady) && (
        <div className="container-custom relative z-10 px-4">
          <div className="text-center max-w-6xl mx-auto pt-24 sm:pt-20">
            {/* Badge */}
            <motion.div
              className="flex items-center justify-center gap-2 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Heart className="w-5 h-5 text-red-400" />
              <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 text-sm px-4 py-2">
                Your Mental Wellness Journey Starts Here
              </Badge>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent leading-tight px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('hero.title')}
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* Featured CTA - Comprehensive Assessment */}
            <motion.div
              className="mb-6 sm:mb-8 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
                <Link href="/comprehensive-assessment" className="flex items-center justify-center gap-2 sm:gap-3">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline">Complete Mental Health Assessment</span>
                  <span className="sm:hidden">Complete Assessment</span>
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
              </Button>
              <p className="text-sm text-gray-400 mt-3 max-w-md mx-auto px-2">
                Comprehensive evaluation combining PHQ-9, GAD-7, Mood Analysis & more
              </p>
            </motion.div>

            {/* Secondary CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 text-base shadow-lg hover:shadow-purple-500/25 transition-all duration-300 w-full sm:w-auto">
                <Link href="/self-check" className="flex items-center justify-center gap-2">
                  Quick Self-Check
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-gray-900 px-6 py-3 text-base transition-all duration-300 w-full sm:w-auto">
                <Link href="/resources" className="flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Explore Resources
                </Link>
              </Button>
            </motion.div>

            {/* Simple Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">15+</div>
                <div className="text-sm sm:text-base text-gray-300">Wellness Resources</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">24/7</div>
                <div className="text-sm sm:text-base text-gray-300">Community Support</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">100%</div>
                <div className="text-sm sm:text-base text-gray-300">Free & Private</div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent z-20" />
    </section>
  );
};