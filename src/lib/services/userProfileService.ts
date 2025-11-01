// User Profile Service - Manages user data based on email using Supabase Auth metadata
import { supabase } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  age: number;
  gender: string;
  created_at: string;
  profile_completed: boolean;
}

// Get current user profile from auth metadata
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const metadata = user.user_metadata || {};
    
    return {
      id: user.id,
      email: user.email || '',
      full_name: metadata.full_name || metadata.name || '',
      age: metadata.age || 0,
      gender: metadata.gender || '',
      created_at: user.created_at,
      profile_completed: !!(metadata.age && metadata.gender)
    };
  } catch (error) {
    console.error('Error getting current user profile:', error);
    return null;
  }
}

// Update user profile in auth metadata and backend
export async function updateUserProfile(
  updates: { age?: number; gender?: string; full_name?: string }
): Promise<UserProfile | null> {
  try {
    // Step 1: Update Supabase Auth metadata
    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...updates,
        profile_completed: true,
        updated_at: new Date().toISOString()
      }
    });

    if (error) {
      console.error('Error updating user profile in Supabase:', error);
      return null;
    }

    if (data.user) {
      // Step 2: Update backend database
      try {
        const profileData = {
          id: data.user.id,
          email: data.user.email,
          full_name: updates.full_name || data.user.user_metadata?.full_name || data.user.user_metadata?.name || 'User',
          age: updates.age || data.user.user_metadata?.age || 0,
          gender: updates.gender || data.user.user_metadata?.gender || ''
        };

        console.log('Syncing profile to backend:', profileData);

        const backendResponse = await fetch('http://localhost:5001/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData)
        });

        if (backendResponse.ok) {
          const backendResult = await backendResponse.json();
          console.log('Backend profile sync successful:', backendResult);
        } else {
          const backendError = await backendResponse.json();
          console.warn('Backend profile sync failed:', backendError);
        }
      } catch (backendError) {
        console.warn('Backend sync error (non-critical):', backendError);
      }

      const metadata = data.user.user_metadata || {};
      return {
        id: data.user.id,
        email: data.user.email || '',
        full_name: metadata.full_name || metadata.name || '',
        age: metadata.age || 0,
        gender: metadata.gender || '',
        created_at: data.user.created_at,
        profile_completed: true
      };
    }

    return null;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return null;
  }
}

// Check if user has complete profile
export async function hasCompleteProfile(): Promise<boolean> {
  try {
    const profile = await getCurrentUserProfile();
    return !!(profile?.age && profile?.gender);
  } catch (error) {
    console.error('Error checking profile completion:', error);
    return false;
  }
}

// Get user by email (for dashboard data filtering)
export function getCurrentUserEmail(): Promise<string | null> {
  return supabase.auth.getUser().then(({ data: { user } }) => user?.email || null);
}