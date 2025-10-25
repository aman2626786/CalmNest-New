'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export const useTranslationReady = (namespace?: string) => {
  const { ready } = useTranslation(namespace);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return {
    isReady: isClient && ready,
    isClient,
    isTranslationReady: ready
  };
};