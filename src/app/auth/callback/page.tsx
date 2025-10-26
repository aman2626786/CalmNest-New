'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const [message, setMessage] = useState('Processing Google authentication...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback started');
        console.log('Current URL:', window.location.href);
        
        // Handle hash-based callback (common for OAuth)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        // Handle search params callback
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        console.log('Hash params:', { accessToken: !!accessToken, refreshToken: !!refreshToken });
        console.log('URL params:', { code: !!code });

        // Method 1: Handle hash-based tokens
        if (accessToken && refreshToken) {
          console.log('Setting session with tokens...');
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Session error:', error);
            setMessage('❌ Authentication failed. Please try again.');
            setTimeout(() => router.push('/login'), 3000);
            return;
          }

          if (data.user) {
            console.log('User authenticated via tokens:', data.user.email);
            await handleSuccessfulAuth(data.user);
            return;
          }
        }

        // Method 2: Handle code-based callback
        if (code) {
          console.log('Exchanging code for session...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('Code exchange error:', error);
            setMessage('❌ Authentication failed. Please try again.');
            setTimeout(() => router.push('/login'), 3000);
            return;
          }

          if (data.user) {
            console.log('User authenticated via code:', data.user.email);
            await handleSuccessfulAuth(data.user);
            return;
          }
        }

        // Method 3: Check existing session
        console.log('Checking existing session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session check error:', sessionError);
          setMessage('❌ Authentication error. Please try signing in again.');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        if (session?.user) {
          console.log('Found existing session:', session.user.email);
          await handleSuccessfulAuth(session.user);
          return;
        }

        // No authentication found
        console.log('No authentication data found');
        setMessage('❌ No authentication data found. Redirecting to login...');
        setTimeout(() => router.push('/login'), 3000);

      } catch (error) {
        console.error('Auth callback error:', error);
        setMessage('❌ Authentication error occurred. Please try signing in again.');
        setTimeout(() => router.push('/login'), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    const handleSuccessfulAuth = async (user: any) => {
      console.log('Handling successful auth for:', user.email);
      console.log('User metadata:', user.user_metadata);
      
      // Check if user has complete profile
      const userData = user.user_metadata || {};
      const hasAge = userData.age || userData.profile_completed;
      const hasGender = userData.gender || userData.profile_completed;
      
      console.log('Profile check:', { hasAge, hasGender, userData });
      
      if (hasAge && hasGender) {
        setMessage('✅ Successfully authenticated! Redirecting to homepage...');
        setTimeout(() => router.push('/'), 1500);
      } else {
        setMessage('✅ Google authentication successful! Please complete your profile...');
        setTimeout(() => router.push('/login'), 1500);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(handleAuthCallback, 100);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
        <div className="mb-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          ) : (
            <div className="text-4xl mb-4">
              {message.includes('✅') ? '✅' : '❌'}
            </div>
          )}
        </div>
        <p className="text-white text-lg">{message}</p>
        {!isLoading && (
          <button
            onClick={() => router.push('/login')}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}