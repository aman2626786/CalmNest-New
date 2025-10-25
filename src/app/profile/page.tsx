'use client';

import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/context/UserProfileContext';

interface ProfileForm {
  full_name: string;
  age: number | '';
  gender: string;
}

export default function ProfilePage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { profile: userProfile, loading: profileLoading, updateProfile, refreshProfile } = useUserProfile();
  const [formData, setFormData] = useState<ProfileForm>({
    full_name: '',
    age: '',
    gender: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  // Update form data when profile loads
  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        age: userProfile.age || '',
        gender: userProfile.gender || ''
      });
    }
  }, [userProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    console.log('Profile update started with data:', formData);
    console.log('Current user session:', session.user.id, session.user.email);

    setSaving(true);
    try {
      const updateData = {
        full_name: formData.full_name.trim(),
        age: typeof formData.age === 'number' ? formData.age : (formData.age ? Number(formData.age) : undefined),
        gender: formData.gender
      };

      console.log('Updating profile with:', updateData);

      // Update using context (now with fallback to localStorage)
      await updateProfile(updateData);

      console.log('Profile updated successfully');
      
      // Small delay to ensure state updates
      setTimeout(() => {
        alert('Profile updated successfully!');
        setIsEditMode(false);
      }, 100);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      // Even if there's an error, try to update localStorage directly
      try {
        const fallbackProfile = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: formData.full_name.trim(),
          age: formData.age,
          gender: formData.gender
        };
        
        localStorage.setItem('userProfile', JSON.stringify(fallbackProfile));
        localStorage.setItem('userName', formData.full_name.trim());
        
        alert('Profile updated locally. Some features may require a refresh.');
        setIsEditMode(false);
      } catch (fallbackError) {
        alert('Error updating profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'age' ? (value === '' ? '' : Number(value)) : value 
    }));
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        age: userProfile.age || '',
        gender: userProfile.gender || ''
      });
    }
    setIsEditMode(false);
  };

  if (profileLoading || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/10 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/10 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border text-foreground">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl text-foreground">User Profile</CardTitle>
              <CardDescription className="text-muted-foreground">Your personal account details.</CardDescription>
            </div>
            {!isEditMode && (
              <Button onClick={() => setIsEditMode(true)} className="bg-purple-600 hover:bg-purple-700">
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-foreground">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="bg-input border-border text-foreground"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-foreground">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="bg-input border-border text-foreground"
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-input border-border text-foreground rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="transgender">Transgender</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-lg text-foreground">{session.user.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-lg text-foreground">
                    {userProfile?.full_name || (
                      <span className="text-muted-foreground italic">Not set</span>
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Age</p>
                  <p className="text-lg text-foreground">
                    {userProfile?.age || (
                      <span className="text-muted-foreground italic">Not set</span>
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Gender</p>
                  <p className="text-lg text-foreground capitalize">
                    {userProfile?.gender || (
                      <span className="text-muted-foreground italic">Not set</span>
                    )}
                  </p>
                </div>
              </div>
              
              {(!userProfile?.full_name || !userProfile?.age || !userProfile?.gender) && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Complete your profile to personalize your experience and help us serve you better.
                  </p>
                </div>
              )}
              
              {/* Manual sync button for testing */}
              <div className="pt-4 border-t border-border flex gap-2">
                <button
                  onClick={() => {
                    const currentName = localStorage.getItem('userName');
                    alert(`Current stored name: ${currentName || 'None'}`);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 border border-border rounded"
                >
                  Check Stored Name
                </button>
                <button
                  onClick={() => {
                    // Force set the name from current profile data
                    if (userProfile?.full_name) {
                      localStorage.setItem('userName', userProfile.full_name);
                      alert(`Name set to: ${userProfile.full_name}`);
                    } else {
                      localStorage.setItem('userName', 'devesh sharma');
                      alert('Name set to: devesh sharma (manual)');
                    }
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 px-2 py-1 border border-purple-500 rounded"
                >
                  Force Set Name
                </button>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">User ID</p>
                  <p className="text-xs text-muted-foreground font-mono">{session.user.id}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}