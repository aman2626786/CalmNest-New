// Demo authentication utilities
export const isDemoMode = () => {
  const isDummyConfig = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy-project') || 
                       !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                       process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://dummy-project.supabase.co';
  return isDummyConfig;
};

export const getDemoUser = () => {
  if (typeof window === 'undefined') return null;
  
  const demoUser = localStorage.getItem('demo_user');
  if (demoUser) {
    try {
      return JSON.parse(demoUser);
    } catch (error) {
      console.error('Error parsing demo user:', error);
      localStorage.removeItem('demo_user');
    }
  }
  return null;
};

export const isAuthenticated = (session: any) => {
  // Check for real session first
  if (session?.user?.id) {
    return true;
  }
  
  // Check for demo user if in demo mode
  if (isDemoMode()) {
    const demoUser = getDemoUser();
    return !!demoUser;
  }
  
  return false;
};

export const getCurrentUser = (session: any) => {
  // Return real user if available
  if (session?.user?.id) {
    return {
      id: session.user.id,
      email: session.user.email,
      isDemo: false
    };
  }
  
  // Return demo user if in demo mode
  if (isDemoMode()) {
    const demoUser = getDemoUser();
    if (demoUser) {
      return {
        id: demoUser.id,
        email: demoUser.email,
        isDemo: true
      };
    }
  }
  
  return null;
};

export const signOutDemo = () => {
  localStorage.removeItem('demo_user');
  localStorage.removeItem('userProfile');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userId');
};