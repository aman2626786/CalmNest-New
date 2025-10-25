'use client';

import { motion } from 'framer-motion';
import { IconBrain, IconCalendar, IconUsers } from './Icons';
import { ClipboardCheck, SmilePlus, Wind, Music, Disc, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const Features = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const features = [
    {
      icon: <ClipboardCheck className="w-8 h-8 text-purple-400" />,
      title: t('features.cards.symptom.title'),
      description: t('features.cards.symptom.description'),
      link: '/self-check',
      color: 'from-purple-500 to-indigo-500',
      badge: 'Assessment'
    },
    {
      icon: <IconCalendar className="w-8 h-8 text-blue-400" />,
      title: t('features.cards.appointments.title'),
      description: t('features.cards.appointments.description'),
      link: '/appointments',
      color: 'from-blue-500 to-cyan-500',
      badge: 'Scheduling'
    },
    {
      icon: <IconBrain className="w-8 h-8 text-green-400" />,
      title: t('features.cards.resources.title'),
      description: t('features.cards.resources.description'),
      link: '/resources',
      color: 'from-green-500 to-emerald-500',
      badge: 'Learning'
    },
    {
      icon: <Disc className="w-8 h-8 text-pink-400" />,
      title: t('features.cards.groove.title'),
      description: t('features.cards.groove.description'),
      link: '/mood-groove',
      color: 'from-pink-500 to-rose-500',
      badge: 'Interactive'
    },
    {
      icon: <IconUsers className="w-8 h-8 text-orange-400" />,
      title: t('features.cards.community.title'),
      description: t('features.cards.community.description'),
      link: '/forum',
      color: 'from-orange-500 to-amber-500',
      badge: 'Community'
    },
    {
      icon: <Wind className="w-8 h-8 text-teal-400" />,
      title: t('features.cards.breathing.title'),
      description: t('features.cards.breathing.description'),
      link: '/breathing',
      color: 'from-teal-500 to-cyan-500',
      badge: 'Wellness'
    },
  ];

  if (!isClient) {
    return <section className="py-20"><div className="container-custom"></div></section>; // Render empty section on server
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container-custom px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20">
              Comprehensive Wellness Tools
            </Badge>
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Everything You Need for Mental Wellness
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover our comprehensive suite of tools designed to support your mental health journey, 
            from self-assessment to community support.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl hover:bg-gray-800/70 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
              
              {/* Badge */}
              <Badge className="mb-4 bg-gray-700/50 text-gray-300 border-gray-600">
                {feature.badge}
              </Badge>
              
              {/* Icon */}
              <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              {/* CTA */}
              <Button asChild variant="ghost" className="w-full justify-between text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 group/btn">
                <Link href={feature.link}>
                  Explore Feature
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-300 mb-6 text-lg">
            Ready to start your wellness journey?
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <Link href="/dashboard" className="flex items-center gap-2">
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};