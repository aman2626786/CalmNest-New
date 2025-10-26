'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Fallback auth functions for production builds
const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const userData = localStorage.getItem('calmnest_current_user');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

const signOutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('calmnest_current_user');
  }
};
import { User, Mail, Calendar, Users, Edit, LogOut, Trash2 } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
    console.log('Profile page - Current user:', currentUser);
  }, [router]);

  const handleSignOut = () => {
    signOutUser();
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Delete from backend
        const response = await fetch(`http://localhost:5001/api/profile/${user.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          console.log('✅ Account deleted from backend');
        }
        
        // Sign out locally
        signOutUser();
        alert('Account deleted successfully.');
        router.push('/');
      } catch (error) {
        console.error('❌ Account deletion error:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6 text-center">
            <p>No user data found. Please sign in again.</p>
            <Button onClick={() => router.push('/login')} className="mt-4">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account information and preferences</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information Card */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Full Name</p>
                    <p className="font-medium">{user.full_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Age</p>
                    <p className="font-medium">{user.age} years old</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Gender</p>
                    <Badge variant="secondary" className="capitalize">
                      {user.gender}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Your account information and activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Account Created</p>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Profile Status</p>
                  <Badge variant="default" className="bg-green-600">
                    Complete
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">User ID</p>
                  <p className="font-mono text-xs text-gray-400">{user.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card className="bg-gray-800 border-gray-700 text-white md:col-span-2">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => router.push('/profile-setup')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                
                <Button 
                  onClick={() => router.push('/profile-setup')}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Edit Profile
                </Button>
                
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
                
                <Button 
                  onClick={handleDeleteAccount}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}