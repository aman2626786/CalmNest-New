'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext'; // Use the central AuthContext

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    age: '',
    gender: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('info');
  const [isSignUp, setIsSignUp] = useState(true);
  const router = useRouter();
  
  const { user, loading, signUp, signIn } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!formData.email || !formData.password || (isSignUp && (!formData.fullName || !formData.age || !formData.gender))) {
      setMessage('Please fill in all required fields.');
      setMessageType('error');
      return;
    }

    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      age: parseInt(formData.age, 10),
      gender: formData.gender
    });

    if (error) {
      setMessage(error.message);
      setMessageType('error');
    } else {
      setMessageType('success');
      setMessage('Sign up successful! Please check your email to confirm.');
    }
  };

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!formData.email || !formData.password) {
      setMessage('Please enter your email and password.');
      setMessageType('error');
      return;
    }

    const { error } = await signIn(formData.email, formData.password);

    if (error) {
      setMessage(error.message);
      setMessageType('error');
    } else {
      setMessageType('success');
      setMessage('Sign in successful! Redirecting...');
    }
  };
  
  if (loading || user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? 'Fill in your details to create your CalmNest account' 
              : 'Enter your email to sign in to your account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
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
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full p-2 bg-gray-700 border-gray-600 text-white rounded-md"
                    required
                  >
                    <option value="" disabled>Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="transgender">Transgender</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            {message && (
              <div className={`text-center text-sm p-3 rounded-lg ${
                messageType === 'error' ? 'bg-red-900/30 text-red-300 border border-red-500/50' :
                messageType === 'success' ? 'bg-green-900/30 text-green-300 border border-green-500/50' :
                'bg-blue-900/30 text-blue-300 border border-blue-500/50'
              }`}>
                {message}
              </div>
            )}
            
            <div className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                disabled={loading}
              >
                {loading 
                  ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                  : (isSignUp ? 'Create Account' : 'Sign In')
                }
              </Button>
              
              <Button 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setMessage('');
                }}
                variant="link" 
                type="button"
                className="text-purple-400 hover:text-purple-300"
              >
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"
                }
              </Button>
              
              <Button 
                onClick={() => router.push('/')} 
                variant="outline" 
                type="button" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Continue as Guest
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
