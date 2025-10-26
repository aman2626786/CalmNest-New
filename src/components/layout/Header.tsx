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
import { Menu, X } from 'lucide-react';
import { DownloadReportButton } from '@/components/layout/DownloadReportButton';

export const Header = () => {
  const { t } = useTranslation('common');
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="fixed w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <nav className="container-custom py-4 flex items-center justify-between">
        <Logo />
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 text-sm">
            <Link href="/self-check" className={`${pathname.startsWith('/self-check') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}>
              {t('nav.selfCheck')}
            </Link>

            <Link href="/resources" className={`${pathname.startsWith('/resources') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}>
              {t('nav.resources')}
            </Link>
            <Link href="/dashboard" className={`${pathname.startsWith('/dashboard') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}>
              {t('nav.dashboard')}
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

        {/* Mobile and Desktop Right Side */}
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-2">
            <LanguageSwitcher />
            {isClient && <ProfileButton />}
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-b border-border/40">
          <div className="container-custom py-4 space-y-4">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/self-check" 
                className={`${pathname.startsWith('/self-check') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors py-2`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.selfCheck')}
              </Link>

              <Link 
                href="/resources" 
                className={`${pathname.startsWith('/resources') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors py-2`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.resources')}
              </Link>
              <Link 
                href="/dashboard" 
                className={`${pathname.startsWith('/dashboard') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors py-2`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>
              <Link 
                href="/forum" 
                className={`${pathname.startsWith('/forum') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors py-2`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.forum')}
              </Link>
              <Link 
                href="/exercises" 
                className={`${pathname.startsWith('/exercises') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors py-2`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.exercises')}
              </Link>
              <Link 
                href="/music-therapy" 
                className={`${pathname.startsWith('/music-therapy') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors py-2`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.musicTherapy')}
              </Link>
              <Link 
                href="/mood-groove" 
                className={`${pathname.startsWith('/mood-groove') ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors py-2`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.moodGroove')}
              </Link>
              <FeedbackButton>
                <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors justify-start p-0">
                  {t('nav.feedback')}
                </Button>
              </FeedbackButton>
            </div>
            
            {/* Mobile Language Switcher and Profile */}
            <div className="flex items-center space-x-4 pt-4 border-t border-border/40">
              <LanguageSwitcher />
              {isClient && <ProfileButton />}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
