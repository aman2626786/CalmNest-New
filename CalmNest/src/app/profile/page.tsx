'use client';

import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Profile {
  full_name: string;
  age: number | '';
  gender: string;
}

export default function ProfilePage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  useEffect(() => {
    if (session) {
      const fetchProfile = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, age, gender')
          .eq('id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [session, supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !profile) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        age: profile.age,
        gender: profile.gender,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    if (error) {
      alert('Error updating profile: ' + error.message);
    } else {
      alert('Profile updated successfully!');
      setIsEditMode(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setProfile(prev => prev ? { ...prev, [id]: value } : null);
  };

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">User Profile</CardTitle>
              <CardDescription>Your personal account details.</CardDescription>
            </div>
            {!isEditMode && (
              <Button onClick={() => setIsEditMode(true)} className="bg-purple-600 hover:bg-purple-700">Edit</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  value={profile?.full_name || ''}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile?.age || ''}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={profile?.gender || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border-gray-600 text-white rounded-md"
                >
                  <option value="" disabled>Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="transgender">Transgender</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="ghost" onClick={() => setIsEditMode(false)}>Cancel</Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-400">Email</p>
                <p className="text-lg">{session.user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-400">Full Name</p>
                <p className="text-lg">{profile?.full_name || 'Not set'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-400">Age</p>
                <p className="text-lg">{profile?.age || 'Not set'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-400">Gender</p>
                <p className="text-lg">{profile?.gender || 'Not set'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-400">User ID</p>
                <p className="text-sm text-gray-500">{session.user.id}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}