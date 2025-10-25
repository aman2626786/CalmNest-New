'use client';

import { useUserProfile } from '@/context/UserProfileContext';
import { useSession } from '@supabase/auth-helpers-react';

export function ProfileDebug() {
  const { profile, loading } = useUserProfile();
  const session = useSession();

  if (!session) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Profile Debug</h3>
      <div className="space-y-1">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Session ID:</strong> {session.user?.id}</p>
        <p><strong>Session Email:</strong> {session.user?.email}</p>
        <p><strong>Profile ID:</strong> {profile?.id || 'None'}</p>
        <p><strong>Profile Name:</strong> {profile?.full_name || 'None'}</p>
        <p><strong>Profile Age:</strong> {profile?.age || 'None'}</p>
        <p><strong>Profile Gender:</strong> {profile?.gender || 'None'}</p>
        <p><strong>LocalStorage Name:</strong> {typeof window !== 'undefined' ? localStorage.getItem('userName') : 'N/A'}</p>
      </div>
    </div>
  );
}