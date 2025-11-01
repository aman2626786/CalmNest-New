// Local authentication system for development when Supabase is not configured
interface LocalUser {
  id: string;
  email: string;
  full_name: string;
  age: number;
  gender: string;
  created_at: string;
  email_confirmed: boolean;
}

const USERS_KEY = 'local_users';
const CURRENT_USER_KEY = 'current_user';

export const localAuth = {
  // Sign up a new user
  signUp: async (email: string, password: string, userData: any) => {
    const users = getStoredUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('User already registered');
    }
    
    // Create new user
    const newUser: LocalUser = {
      id: 'local_' + Date.now(),
      email,
      full_name: userData.full_name,
      age: userData.age,
      gender: userData.gender,
      created_at: new Date().toISOString(),
      email_confirmed: false // Simulate email confirmation requirement
    };
    
    // Store user
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Store password separately (in real app, this would be hashed)
    const passwords = getStoredPasswords();
    passwords[email] = password;
    localStorage.setItem('local_passwords', JSON.stringify(passwords));
    
    return { user: newUser, error: null };
  },
  
  // Sign in existing user
  signIn: async (email: string, password: string) => {
    const users = getStoredUsers();
    const passwords = getStoredPasswords();
    
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid login credentials');
    }
    
    if (passwords[email] !== password) {
      throw new Error('Invalid login credentials');
    }
    
    if (!user.email_confirmed) {
      throw new Error('Please confirm your email first. Check your email for confirmation link.');
    }
    
    // Set current user
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    
    return { user, error: null };
  },
  
  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // Sign out
  signOut: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },
  
  // Simulate email confirmation
  confirmEmail: (email: string) => {
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].email_confirmed = true;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    }
    return false;
  },
  
  // Check if using local auth
  isLocalAuth: () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return !supabaseUrl || 
           supabaseUrl.includes('your-project-ref') || 
           supabaseUrl.includes('placeholder');
  },
  
  // Set auth cookie for middleware
  setAuthCookie: () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'local_auth=authenticated; path=/; max-age=86400'; // 24 hours
    }
  },
  
  // Clear auth cookie
  clearAuthCookie: () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'local_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
};

// Helper functions
function getStoredUsers(): LocalUser[] {
  if (typeof window === 'undefined') return [];
  const usersStr = localStorage.getItem(USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
}

function getStoredPasswords(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const passwordsStr = localStorage.getItem('local_passwords');
  return passwordsStr ? JSON.parse(passwordsStr) : {};
}

// Auto-confirm email for development (simulate clicking email link)
export const autoConfirmEmail = (email: string) => {
  setTimeout(() => {
    localAuth.confirmEmail(email);
    console.log(`✅ Email auto-confirmed for development: ${email}`);
  }, 2000);
};