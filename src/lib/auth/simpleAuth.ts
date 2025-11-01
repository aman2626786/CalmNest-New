// Simple Authentication System - Works without Supabase database issues
// Uses localStorage + backend for user management

interface SimpleUser {
  id: string;
  email: string;
  full_name: string;
  age: number;
  gender: string;
  created_at: string;
  profile_completed: boolean;
}

const BACKEND_URL = 'http://localhost:5001';
const LOCAL_USER_KEY = 'calmnest_current_user';

// Generate simple user ID
function generateUserId(): string {
  return 'local_' + Date.now();
}

// Save user to localStorage
function saveUserLocally(user: SimpleUser): void {
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

// Get current user from localStorage
export function getCurrentUser(): SimpleUser | null {
  try {
    const userData = localStorage.getItem(LOCAL_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Create user account (Google-like flow)
export async function createUserAccount(
  email: string,
  full_name: string,
  age: number,
  gender: string
): Promise<{ success: boolean; user?: SimpleUser; error?: string }> {
  try {
    console.log('🔄 Creating user account:', { email, full_name, age, gender });

    // Create user object
    const newUser: SimpleUser = {
      id: generateUserId(),
      email,
      full_name,
      age,
      gender,
      created_at: new Date().toISOString(),
      profile_completed: true
    };

    // Save locally first
    saveUserLocally(newUser);
    console.log('✅ User saved locally:', newUser);

    // Also maintain a list of all users for signin lookup
    try {
      const allUsers = JSON.parse(localStorage.getItem('calmnest_all_users') || '[]');
      const existingIndex = allUsers.findIndex((u: SimpleUser) => u.email === newUser.email);
      if (existingIndex >= 0) {
        allUsers[existingIndex] = newUser;
      } else {
        allUsers.push(newUser);
      }
      localStorage.setItem('calmnest_all_users', JSON.stringify(allUsers));
      console.log('✅ User added to all users list');
    } catch (error) {
      console.warn('⚠️ Failed to update all users list:', error);
    }

    // Try to save to backend
    try {
      const backendResponse = await fetch(`${BACKEND_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });

      if (backendResponse.ok) {
        const backendResult = await backendResponse.json();
        console.log('✅ User saved to backend:', backendResult);
      } else {
        const backendError = await backendResponse.json();
        console.warn('⚠️ Backend save failed (non-critical):', backendError);
      }
    } catch (backendError) {
      console.warn('⚠️ Backend not available (non-critical):', backendError);
    }

    return { success: true, user: newUser };
  } catch (error: any) {
    console.error('❌ User creation error:', error);
    return { success: false, error: error.message };
  }
}

// Sign in user (check if exists)
export async function signInUser(email: string): Promise<{ success: boolean; user?: SimpleUser; error?: string }> {
  try {
    console.log('🔄 Signing in user:', email);

    // Strategy 1: Check localStorage first (fastest)
    try {
      const allUsers = JSON.parse(localStorage.getItem('calmnest_all_users') || '[]');
      const localUser = allUsers.find((u: SimpleUser) => u.email.toLowerCase() === email.toLowerCase());
      
      if (localUser) {
        console.log('✅ User found in localStorage:', localUser);
        saveUserLocally(localUser);
        return { success: true, user: localUser };
      }
    } catch (localError) {
      console.warn('⚠️ localStorage check failed:', localError);
    }

    // Strategy 2: Try to get from backend
    try {
      const backendResponse = await fetch(`${BACKEND_URL}/api/profile/email/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (backendResponse.ok) {
        const backendUser = await backendResponse.json();
        console.log('✅ User found in backend:', backendUser);
        
        const user: SimpleUser = {
          id: backendUser.id,
          email: backendUser.email,
          full_name: backendUser.full_name,
          age: backendUser.age,
          gender: backendUser.gender,
          created_at: backendUser.created_at,
          profile_completed: true
        };

        saveUserLocally(user);
        
        // Also save to all users list for future quick access
        const allUsers = JSON.parse(localStorage.getItem('calmnest_all_users') || '[]');
        const existingIndex = allUsers.findIndex((u: SimpleUser) => u.email === user.email);
        if (existingIndex >= 0) {
          allUsers[existingIndex] = user;
        } else {
          allUsers.push(user);
        }
        localStorage.setItem('calmnest_all_users', JSON.stringify(allUsers));
        
        return { success: true, user };
      } else {
        console.warn('⚠️ User not found in backend');
      }
    } catch (backendError) {
      console.warn('⚠️ Backend signin failed:', backendError);
    }

    return { success: false, error: 'User not found. Please sign up first.' };
  } catch (error: any) {
    console.error('❌ Sign in error:', error);
    return { success: false, error: error.message };
  }
}

// Sign out user
export function signOutUser(): void {
  localStorage.removeItem(LOCAL_USER_KEY);
  console.log('✅ User signed out');
}

// Update user profile
export async function updateUserProfile(
  updates: { age?: number; gender?: string; full_name?: string }
): Promise<{ success: boolean; user?: SimpleUser; error?: string }> {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'No user found' };
    }

    const updatedUser: SimpleUser = {
      ...currentUser,
      ...updates,
      profile_completed: true
    };

    saveUserLocally(updatedUser);
    console.log('✅ User profile updated locally:', updatedUser);

    // Try to update backend
    try {
      const backendResponse = await fetch(`${BACKEND_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser)
      });

      if (backendResponse.ok) {
        const backendResult = await backendResponse.json();
        console.log('✅ User profile updated in backend:', backendResult);
      }
    } catch (backendError) {
      console.warn('⚠️ Backend update failed (non-critical):', backendError);
    }

    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error('❌ Profile update error:', error);
    return { success: false, error: error.message };
  }
}

// Debug function - get all registered users
export function getAllRegisteredUsers(): SimpleUser[] {
  try {
    return JSON.parse(localStorage.getItem('calmnest_all_users') || '[]');
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

// Debug function - check if email exists
export function checkEmailExists(email: string): boolean {
  const allUsers = getAllRegisteredUsers();
  return allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
}

// Debug function - clear all users (for testing)
export function clearAllUsers(): void {
  localStorage.removeItem('calmnest_all_users');
  localStorage.removeItem(LOCAL_USER_KEY);
  console.log('✅ All users cleared');
}