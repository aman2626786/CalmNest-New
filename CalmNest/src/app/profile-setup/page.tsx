'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Removed toast import because '@/components/ui/use-toast' does not exist

export default function ProfileSetupPage() {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Using inline messages instead of toast

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from('profiles').update({
        full_name: fullName,
        age: age,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);

      if (error) {
        setMessage(`Error updating profile: ${error.message}`);
      } else {
        setMessage('Profile setup complete! Redirecting...');
        router.push('/dashboard'); // Redirect to dashboard after setup
      }
    } else {
        setMessage('You must be logged in to set up a profile.');
        // toast({
        //     title: "Authentication Error",
        //     description: "User not found. Please log in again.",
        //     variant: "destructive",
        // });
        router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>Please fill in your details to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSetup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            {message && <p className="text-center text-sm text-gray-300">{message}</p>}
            <div className="flex flex-col space-y-4">
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                    {loading ? 'Saving...' : 'Save and Continue'}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
