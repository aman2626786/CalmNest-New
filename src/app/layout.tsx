'use client';

import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import I18nProvider from '@/components/I18nProvider';
import { MoodProvider } from '@/context/MoodContext';
import { ResultsProvider } from '@/context/ResultsContext';
import { UserProfileProvider } from '@/context/UserProfileContext';
import { VoiceflowContextUpdater } from '@/components/VoiceflowContextUpdater';
import { Header } from '@/components/layout/Header';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

declare global {
  interface Window {
    voiceflow: any;
  }
}

export const metadata = {
  title: 'CalmNest - Your Mental Wellness Journey',
  description: 'A Safe Digital Space for Students to Prioritize their Mental Well-being.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionContextProvider supabaseClient={supabase}>
            <UserProfileProvider>
              <I18nProvider>
                <MoodProvider>
                  <ResultsProvider>
                    <VoiceflowContextUpdater />
                    <Header />
                    <main className="pt-20">{children}</main>
                  </ResultsProvider>
                </MoodProvider>
              </I18nProvider>
            </UserProfileProvider>
          </SessionContextProvider>
        </ThemeProvider>

        <Script
          strategy="lazyOnload"
          onLoad={() => {
            if (window.voiceflow) {
              window.voiceflow.chat.load({
                verify: { projectID: '68f116283303c3139e725906' },
                url: 'https://general-runtime.voiceflow.com',
                versionID: 'production'
              });
            }
          }}
          src="https://cdn.voiceflow.com/widget-next/bundle.mjs"
        />
      </body>
    </html>
  );
}
