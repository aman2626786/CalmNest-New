// Backend Sync Service - Syncs data with Flask backend
import { supabase } from '@/lib/supabase/client';

const BACKEND_URL = 'http://localhost:5001';

// Sync user profile to backend
export async function syncUserProfileToBackend(userId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.id !== userId) {
      console.error('User not authenticated or ID mismatch');
      return false;
    }

    const metadata = user.user_metadata || {};
    const profileData = {
      id: user.id,
      email: user.email,
      full_name: metadata.full_name || metadata.name || 'User',
      age: metadata.age || 0,
      gender: metadata.gender || ''
    };

    console.log('🔄 Syncing user profile to backend:', profileData);

    const response = await fetch(`${BACKEND_URL}/api/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Backend sync successful:', result);
      return true;
    } else {
      const error = await response.json();
      console.warn('⚠️ Backend sync failed:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Backend sync error:', error);
    return false;
  }
}

// Get user profile from backend
export async function getUserProfileFromBackend(userId: string): Promise<any | null> {
  try {
    console.log('🔍 Fetching user profile from backend:', userId);

    const response = await fetch(`${BACKEND_URL}/api/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const profile = await response.json();
      console.log('✅ Backend profile fetched:', profile);
      return profile;
    } else {
      const error = await response.json();
      console.warn('⚠️ Backend profile fetch failed:', error);
      return null;
    }
  } catch (error) {
    console.error('❌ Backend profile fetch error:', error);
    return null;
  }
}

// Test backend connection
export async function testBackendConnection(): Promise<boolean> {
  try {
    console.log('🔗 Testing backend connection...');

    const response = await fetch(`${BACKEND_URL}/`, {
      method: 'GET',
    });

    if (response.ok) {
      const result = await response.text();
      console.log('✅ Backend connection successful:', result);
      return true;
    } else {
      console.warn('⚠️ Backend connection failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Backend connection error:', error);
    return false;
  }
}

// Sync user data on login
export async function syncUserDataOnLogin(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No user to sync');
      return;
    }

    console.log('🔄 Starting user data sync for:', user.email);

    // Test backend connection first
    const isBackendConnected = await testBackendConnection();
    if (!isBackendConnected) {
      console.warn('Backend not available, skipping sync');
      return;
    }

    // Sync profile
    await syncUserProfileToBackend(user.id);

    console.log('✅ User data sync completed');
  } catch (error) {
    console.error('❌ User data sync error:', error);
  }
}