'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';
import { localAuth } from '@/lib/localAuth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseAvailable() && supabase) {
        // Use real Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          }
        );

        setLoading(false);
        return () => subscription.unsubscribe();
      } else {
        // Use local auth fallback
        console.log('Using local auth fallback');
        const localUser = localAuth.getCurrentUser();
        if (localUser) {
          // Create a mock user object
          const mockUser = {
            id: localUser.id,
            email: localUser.email,
            user_metadata: {
              full_name: localUser.full_name,
              age: localUser.age,
              gender: localUser.gender
            }
          } as User;
          
          setUser(mockUser);
        }
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      if (isSupabaseAvailable() && supabase) {
        // Use real Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData || {}
          }
        });

        if (error) {
          console.error('Sign up error:', error);
          return { error };
        }

        console.log('Sign up successful:', data.user?.email);
        return { error: null };
      } else {
        // Use local auth fallback
        console.log('Using local auth for signup');
        await localAuth.signUp(email, password, userData);
        return { error: null };
      }
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (isSupabaseAvailable() && supabase) {
        // Use real Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          console.error('Sign in error:', error);
          return { error };
        }

        console.log('Sign in successful:', data.user?.email);
        return { error: null };
      } else {
        // Use local auth fallback
        console.log('Using local auth for signin');
        const result = await localAuth.signIn(email, password);
        
        // Create mock user object
        const mockUser = {
          id: result.user.id,
          email: result.user.email,
          user_metadata: {
            full_name: result.user.full_name,
            age: result.user.age,
            gender: result.user.gender
          }
        } as User;
        
        setUser(mockUser);
        return { error: null };
      }
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      if (isSupabaseAvailable() && supabase) {
        // Use real Supabase
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          console.error('Sign out error:', error);
          return { error };
        }
      } else {
        // Use local auth fallback
        localAuth.signOut();
        setUser(null);
        setSession(null);
      }

      console.log('Sign out successful');
      return { error: null };
    } catch (error) {
      console.error('Sign out exception:', error);
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('Reset password error:', error);
        return { error };
      }

      console.log('Reset password email sent');
      return { error: null };
    } catch (error) {
      console.error('Reset password exception:', error);
      return { error: error as AuthError };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}