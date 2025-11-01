'use client';

import { useEffect } from 'react';

export const TitleUpdater = () => {
  useEffect(() => {
    // Force update the document title to ensure it shows CalmNest
    document.title = 'CalmNest - Your Mental Wellness Journey';
  }, []);

  return null;
};