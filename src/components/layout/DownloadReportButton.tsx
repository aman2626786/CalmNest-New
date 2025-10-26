'use client';

import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { Download } from 'lucide-react';

export const DownloadReportButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation('dashboard');
  const pathname = usePathname();

  // Only show the button on the dashboard page
  if (!pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className="hidden md:flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {t('downloadReport')}
    </Button>
  );
};