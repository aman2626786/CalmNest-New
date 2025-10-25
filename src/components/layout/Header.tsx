'use client';

import { Logo } from '@/components/common/Logo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FeedbackButton } from '@/components/features/feedback/FeedbackButton';
import { ProfileButton } from '@/components/layout/ProfileButton';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="fixed w-full z-50 bg-background/80 backdrop-blur-sm">
      <nav className="container-custom py-4 flex items-center justify-between">
        <Logo />
        
        <div className="hidden md:flex items-center space-x-4 text-sm">
            <Link href="/dashboard" className={`${pathname.startsWith('/dashboard') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}>
              {t('nav.dashboard')}
            </Link>
            <Link href="/self-check" className={`${pathname.startsWith('/self-check') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}>
              {t('nav.selfCheck')}
            </Link>
            <Link href="/appointments" className={`${pathname.startsWith('/appointments') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}>
              {t('nav.appointments')}
            </Link>
            <Link href="/resources" className={`${pathname.startsWith('/resources') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}>
              {t('nav.resources')}
            </Link>
            <Link href="/forum" className={`${pathname.startsWith('/forum') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}>
              {t('nav.forum')}
            </Link>
            <Link href="/exercises" className={`${pathname.startsWith('/exercises') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}>
              {t('nav.exercises')}
            </Link>
            <Link href="/music-therapy" className={`${pathname.startsWith('/music-therapy') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}>
              {t('nav.musicTherapy')}
            </Link>
            <Link href="/mood-groove" className={`${pathname.startsWith('/mood-groove') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}>
              {t('nav.moodGroove')}
            </Link>
            <FeedbackButton>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors">
                {t('nav.feedback')}
              </Button>
            </FeedbackButton>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          {isClient && <ProfileButton />}
        </div>
      </nav>
    </header>
  );
};
