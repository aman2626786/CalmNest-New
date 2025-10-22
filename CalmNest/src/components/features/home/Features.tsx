'use client';

import { motion } from 'framer-motion';
import { IconBrain, IconCalendar, IconUsers } from './Icons';
import { ClipboardCheck, SmilePlus, Wind, Music, Disc } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export const Features = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const features = [
    {
      icon: <ClipboardCheck className="w-12 h-12 text-purple-400" />,
      title: t('features.cards.symptom.title'),
      description: t('features.cards.symptom.description'),
    },
    {
      icon: <IconCalendar className="w-12 h-12 text-purple-400" />,
      title: t('features.cards.appointments.title'),
      description: t('features.cards.appointments.description'),
    },
    {
      icon: <IconBrain className="w-12 h-12 text-purple-400" />,
      title: t('features.cards.resources.title'),
      description: t('features.cards.resources.description'),
    },
    {
      icon: <Disc className="w-12 h-12 text-purple-400" />,
      title: t('features.cards.groove.title'),
      description: t('features.cards.groove.description'),
    },
    {
      icon: <IconUsers className="w-12 h-12 text-purple-400" />,
      title: t('features.cards.community.title'),
      description: t('features.cards.community.description'),
    },
    {
      icon: <Wind className="w-12 h-12 text-purple-400" />,
      title: t('features.cards.breathing.title'),
      description: t('features.cards.breathing.description'),
    },
  ];

  if (!isClient) {
    return <section className="py-20"><div className="container-custom"></div></section>; // Render empty section on server
  }

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/50 p-8 rounded-xl flex flex-col items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 mb-6 bg-gray-900 rounded-lg flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-left">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};