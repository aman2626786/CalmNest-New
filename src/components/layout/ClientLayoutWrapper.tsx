'use client';

import Script from 'next/script';
import I18nProvider from '@/components/I18nProvider';
import { MoodProvider } from '@/context/MoodContext';
import { ResultsProvider } from '@/context/ResultsContext';
import { UserProfileProvider } from '@/context/UserProfileContext';
import { VoiceflowContextUpdater } from '@/components/VoiceflowContextUpdater';
import { Header } from '@/components/layout/Header';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';

declare global {
  interface Window {
    voiceflow: any;
  }
}

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
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
        </AuthProvider>
      </ThemeProvider>

      <Script
        strategy="lazyOnload"
        onLoad={() => {
          if (window.voiceflow) {
            window.voiceflow.chat.load({
              verify: { projectID: '6904e195103327a086f77862' },
              url: 'https://general-runtime.voiceflow.com',
              versionID: 'production',
              voice: {
                url: "https://runtime-api.voiceflow.com"
              }
            });
          }
        }}
        src="https://cdn.voiceflow.com/widget-next/bundle.mjs"
      />
    </>
  );
}