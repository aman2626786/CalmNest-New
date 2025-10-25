// Utility to sync profile data across the app
export const syncProfileData = (profile: any) => {
  if (typeof window !== 'undefined' && profile) {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('userName', profile.full_name || '');
    localStorage.setItem('userEmail', profile.email || '');
    localStorage.setItem('userId', profile.id || '');
    
    console.log('Profile data synced:', {
      name: profile.full_name,
      email: profile.email,
      id: profile.id
    });
  }
};

export const getProfileData = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const profileStr = localStorage.getItem('userProfile');
    return profileStr ? JSON.parse(profileStr) : null;
  } catch (error) {
    console.error('Error parsing profile data:', error);
    return null;
  }
};

export const getUserDisplayName = () => {
  if (typeof window === 'undefined') return 'Anonymous';
  
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  
  if (userName && userName.trim()) {
    return userName.trim();
  }
  
  if (userEmail) {
    return userEmail.split('@')[0];
  }
  
  return 'Anonymous';
};