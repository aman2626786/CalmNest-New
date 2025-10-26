'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
// Fallback localAuth for production builds
const localAuth = {
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    try {
      const userData = localStorage.getItem('current_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },
  isLocalAuth: () => true
};

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  age?: number;
  gender?: string;
  updated_at?: string;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const supabase = useSupabaseClient();

  const fetchProfile = async () => {
    // Check for local auth user first
    const localUser = localAuth.getCurrentUser();
    if (localUser && !session?.user?.id) {
      const userProfile: UserProfile = {
        id: localUser.id,
        email: localUser.email,
        full_name: localUser.full_name,
        age: localUser.age,
        gender: localUser.gender,
      };
      setProfile(userProfile);
      setLoading(false);
      console.log('Using local auth profile:', userProfile);
      return;
    }

    // Check for demo user (legacy support)
    const demoUser = localStorage.getItem('demo_user');
    if (demoUser && !session?.user?.id) {
      try {
        const demoProfile = JSON.parse(demoUser);
        const userProfile: UserProfile = {
          id: demoProfile.id,
          email: demoProfile.email,
          full_name: demoProfile.full_name,
          age: demoProfile.age,
          gender: demoProfile.gender,
        };
        setProfile(userProfile);
        setLoading(false);
        console.log('Using demo profile:', userProfile);
        return;
      } catch (error) {
        console.error('Error parsing demo user:', error);
        localStorage.removeItem('demo_user');
      }
    }

    if (!session?.user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Try to fetch from Flask backend first
      const response = await fetch(`http://127.0.0.1:5001/api/profile/${session.user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        const userProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: data.full_name,
          age: data.age,
          gender: data.gender,
          updated_at: data.updated_at
        };
        
        setProfile(userProfile);
        
        // Store in localStorage for quick access
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('userEmail', session.user.email || '');
        localStorage.setItem('userId', session.user.id);
        localStorage.setItem('userName', data.full_name || '');
        
        console.log('Profile fetched from Flask backend:', userProfile);
      } else if (response.status === 404) {
        // If no profile found, create basic profile from session
        const basicProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || ''
        };
        
        setProfile(basicProfile);
        localStorage.setItem('userProfile', JSON.stringify(basicProfile));
        localStorage.setItem('userEmail', session.user.email || '');
        localStorage.setItem('userId', session.user.id);
        localStorage.setItem('userName', basicProfile.full_name || '');
        
        console.log('No profile found, created basic profile:', basicProfile);
      } else {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // Fallback to session data
      if (session?.user) {
        const fallbackProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || ''
        };
        setProfile(fallbackProfile);
        localStorage.setItem('userProfile', JSON.stringify(fallbackProfile));
        localStorage.setItem('userEmail', session.user.email || '');
        localStorage.setItem('userId', session.user.id);
        localStorage.setItem('userName', fallbackProfile.full_name || '');
        
        console.log('Using fallback profile:', fallbackProfile);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!session?.user?.id) {
      console.error('No session or user ID available for profile update');
      return;
    }

    console.log('UserProfileContext: Updating profile with data:', data);
    console.log('Current profile:', profile);

    try {
      // Create updated profile object
      const updatedProfile = { 
        id: session.user.id,
        email: session.user.email || '',
        full_name: data.full_name,
        age: data.age,
        gender: data.gender,
        updated_at: new Date().toISOString()
      };

      // Try Flask backend update
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/profile/${session.user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: session.user.email,
            full_name: data.full_name,
            age: data.age,
            gender: data.gender
          }),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('Profile updated successfully in Flask backend:', responseData);
          
          // Update with the response data
          const serverProfile = responseData.profile;
          updatedProfile.updated_at = serverProfile.updated_at;
        } else {
          console.log('Flask backend update failed, continuing with localStorage only');
        }
      } catch (backendError) {
        console.log('Flask backend operations failed, using localStorage only:', backendError);
      }

      // Always update local state and localStorage (this is the important part)
      console.log('Updating local profile state:', updatedProfile);
      setProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      localStorage.setItem('userName', updatedProfile.full_name || '');
      localStorage.setItem('userEmail', updatedProfile.email || '');
      localStorage.setItem('userId', updatedProfile.id);

      console.log('Profile updated successfully in localStorage');

    } catch (error) {
      console.error('Critical error updating profile:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    if (session?.user?.id) {
      console.log('UserProfileContext: Session detected, fetching profile for:', session.user.id);
      fetchProfile();
    } else {
      // Check for local auth user or demo user when no session
      const localUser = localAuth.getCurrentUser();
      const demoUser = localStorage.getItem('demo_user');
      
      if (localUser || demoUser) {
        console.log('UserProfileContext: No session but local/demo user found, fetching profile');
        fetchProfile();
      } else {
        console.log('UserProfileContext: No session and no local/demo user, clearing profile data');
        setProfile(null);
        setLoading(false);
        // Clear localStorage when no session and no local user
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
      }
    }
  }, [session?.user?.id]);

  return (
    <UserProfileContext.Provider value={{ profile, loading, updateProfile, refreshProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}