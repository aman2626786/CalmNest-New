'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

interface HydrationSafeTranslationProps {
  translationKey: string;
  fallbackText: string;
  namespace?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

export const HydrationSafeTranslation: React.FC<HydrationSafeTranslationProps> = ({
  translationKey,
  fallbackText,
  namespace = 'common',
  className = '',
  as: Component = 'span',
  children
}) => {
  const { t, ready } = useTranslation(namespace);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR and initial hydration, always show fallback text
  if (!isClient || !ready) {
    return (
      <Component className={className} suppressHydrationWarning>
        {fallbackText}
        {children}
      </Component>
    );
  }

  // After hydration and translations are ready, show translated text
  return (
    <Component className={className}>
      {t(translationKey)}
      {children}
    </Component>
  );
};