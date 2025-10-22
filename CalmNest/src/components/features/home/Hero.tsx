'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export const Hero = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 via-purple-900/10 to-gray-900" />

      {/* Content - Render only on the client */}
      {isClient && (
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto pt-20">
            <motion.h1 
              className="section-title text-6xl md:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p 
              className="section-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/self-check" className="btn-primary">
                {t('hero.cta')}
              </Link>
            </motion.div>
          </div>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0A0A1B] to-transparent" />
    </section>
  );
};