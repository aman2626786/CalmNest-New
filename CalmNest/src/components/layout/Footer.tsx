'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export const Footer = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center items-center space-x-6 mb-8">
          <Link href="/about" className="hover:text-purple-400 transition-colors">
            {t('footer.about.title')}
          </Link>
          <Link href="/privacy" className="hover:text-purple-400 transition-colors">
            {t('footer.legal.privacy')}
          </Link>
          <Link href="/crisis" className="hover:text-purple-400 transition-colors">
            {t('footer.emergency.helplines')}
          </Link>
          <Link href="/contact" className="hover:text-purple-400 transition-colors">
            {t('footer.contact')}
          </Link>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-center text-sm mt-2">
            {t('footer.disclaimer')}
          </p>
        </div>
      </div>
    </footer>
  );
};