'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseAvailable } from '@/lib/supabase/client';

const localAuth = {
  signUp: async (email: string, password: string, userData?: any) => {
    try {
      // Simple localStorage-based auth for production
      const users = JSON.parse(localStorage.getItem('local_users') || '[]');
      if (users.find((u: any) => u.email === email)) {
        return { error: { message: 'User already exists' } };
      }
      
      const newUser = {
        id: 'local_' + Date.now(),
        email,
        ...userData,
        created_at: new Date().toISOString(),
        email_confirmed: true
      };
      
      users.push(newUser);
      localStorage.setItem('local_users', JSON.stringify(users));
      localStorage.setItem('current_user', JSON.stringify(newUser));
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('local_users') || '[]');
      console.log('Local auth signin - stored users:', users);
      console.log('Local auth signin - looking for email:', email);
      
      const user = users.find((u: any) => u.email === email);
      console.log('Local auth signin - found user:', user);
      
      if (!user) {
        return { error: { message: 'User not found in local storage' } };
      }
      
      localStorage.setItem('current_user', JSON.stringify(user));
      console.log('Local auth signin - success for:', email);
      return { error: null };
    } catch (error: any) {
      console.error('Local auth signin error:', error);
      return { error: { message: error.message } };
    }
  },
  
  signOut: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('current_user');
    }
  },
  
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    try {
      const userData = localStorage.getItem('current_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },
  
  isLocalAuth: () => true,
  
  setAuthCookie: () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'auth=true; path=/; max-age=86400';
    }
  },
  
  clearAuthCookie: () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
};

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
            
            // Clear any old localStorage data to prevent conflicts
            if (typeof window !== 'undefined') {
              localStorage.removeItem('userEmail');
            }
            
            setLoading(false);
          }
        );

        setLoading(false);
        return () => subscription.unsubscribe();
      } else {
        // Use local auth fallback
        console.log('Using local auth fallback');
        const localUser = localAuth.getCurrentUser();
        
        // Also check localStorage for userEmail as backup
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
        
        if (localUser || userEmail) {
          let mockUser;
          
          if (localUser) {
            // Create a mock user object from local auth
            mockUser = {
              id: localUser.id,
              email: localUser.email,
              user_metadata: {
                full_name: localUser.full_name,
                age: localUser.age,
                gender: localUser.gender
              }
            } as User;
          } else if (userEmail) {
            // Create a mock user from stored email
            mockUser = {
              id: `user_${Date.now()}`,
              email: userEmail,
              user_metadata: {
                full_name: 'User',
                age: 25,
                gender: 'not-specified'
              }
            } as User;
          }
          
          setUser(mockUser);
          
          // Always set auth cookie for middleware when user exists
          console.log('AuthContext: Setting auth cookie for existing user');
          localAuth.setAuthCookie();
          
          // Also set email cookie for middleware
          if (typeof document !== 'undefined') {
            const email = localUser?.email || userEmail;
            document.cookie = `userEmail=${email}; path=/; max-age=86400`;
          }
        } else {
          // Clear auth cookie if no user
          console.log('AuthContext: No local user found, clearing auth cookie');
          localAuth.clearAuthCookie();
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
        console.log('Attempting Supabase signup with:', { email, redirectTo: `${window.location.origin}/auth/callback` });
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData || {},
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (error) {
          console.error('Sign up error:', error);
          return { error };
        }

        console.log('Sign up successful:', data.user?.email);
        console.log('User confirmation status:', data.user?.email_confirmed_at);
        console.log('Session:', data.session);
        
        // If user is created, set user state and cookies for immediate access
        if (data.user) {
          console.log('User created, setting user state for immediate access');
          setUser(data.user);
          setSession(data.session);
          
          // Set authentication cookies for middleware
          if (typeof document !== 'undefined') {
            document.cookie = `local_auth=authenticated; path=/; max-age=86400`;
            document.cookie = `userEmail=${data.user.email}; path=/; max-age=86400`;
          }
          
          // Create user profile in database
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const profileResponse = await fetch(`${apiUrl}/api/profile/${data.user.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: data.user.email,
                full_name: userData?.full_name || '',
                age: userData?.age || null,
                gender: userData?.gender || null
              })
            });

            if (profileResponse.ok) {
              console.log('User profile created in database');
            } else {
              console.error('Failed to create user profile:', await profileResponse.text());
            }
          } catch (profileError) {
            console.error('Error creating user profile:', profileError);
          }
        }
        
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
          
          // For development: if email not confirmed, try to fetch user from database
          if (error.message.includes('Email not confirmed') || error.message.includes('Invalid login credentials')) {
            console.log('Supabase auth failed, trying database lookup for unconfirmed user');
            
            try {
              // Try to fetch user profile from database
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
              const profileResponse = await fetch(`${apiUrl}/api/profile/email/${email}`);
              
              if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                console.log('Found user profile in database:', profileData);
                
                // Create mock user object from database profile
                const mockUser = {
                  id: profileData.id,
                  email: profileData.email,
                  user_metadata: {
                    full_name: profileData.full_name,
                    age: profileData.age,
                    gender: profileData.gender
                  }
                } as User;
                
                setUser(mockUser);
                
                // Set auth cookies for middleware
                if (typeof document !== 'undefined') {
                  document.cookie = `local_auth=authenticated; path=/; max-age=86400`;
                  document.cookie = `userEmail=${profileData.email}; path=/; max-age=86400`;
                }
                
                // Store in localStorage for backup
                if (typeof window !== 'undefined') {
                  localStorage.setItem('userEmail', profileData.email);
                  localStorage.setItem('current_user', JSON.stringify({
                    id: profileData.id,
                    email: profileData.email,
                    full_name: profileData.full_name,
                    age: profileData.age,
                    gender: profileData.gender
                  }));
                }
                
                console.log('Successfully signed in unconfirmed user via database lookup');
                return { error: null };
              } else {
                console.log('User profile not found in database');
              }
            } catch (dbError) {
              console.error('Database lookup failed:', dbError);
            }
            
            return { error: { message: 'Email not confirmed. Please check your email for confirmation link.' } as AuthError };
          }
          
          return { error };
        }

        console.log('Sign in successful:', data.user?.email);
        return { error: null };
      } else {
        // Use local auth fallback
        console.log('Using local auth for signin');
        const result = await localAuth.signIn(email, password);
        
        if (result.error) {
          return result;
        }
        
        // Get user from localStorage
        const localUser = localAuth.getCurrentUser();
        
        // Create mock user object
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
        
        // Set auth cookie for middleware
        localAuth.setAuthCookie();
        
        // Also set email cookie for middleware
        if (typeof document !== 'undefined') {
          document.cookie = `userEmail=${result.user.email}; path=/; max-age=86400`;
        }
        
        // Also store email in localStorage for backup
        if (typeof window !== 'undefined') {
          localStorage.setItem('userEmail', result.user.email);
        }
        
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
        
        // Clear user state
        setUser(null);
        setSession(null);
      } else {
        // Use local auth fallback
        localAuth.signOut();
        setUser(null);
        setSession(null);
        
        // Clear auth cookie
        localAuth.clearAuthCookie();
        
        // Clear email cookie
        if (typeof document !== 'undefined') {
          document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          localStorage.removeItem('userEmail');
        }
      }

      // Clear any localStorage data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('current_user');
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
      if (isSupabaseAvailable() && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback`
        });

        if (error) {
          console.error('Reset password error:', error);
          return { error };
        }

        console.log('Reset password email sent');
        return { error: null };
      } else {
        // Local auth fallback - just return success
        console.log('Reset password (local auth fallback)');
        return { error: null };
      }
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