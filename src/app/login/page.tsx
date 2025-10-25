'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, signUp, signIn, loading } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    
    // Validate required fields
    if (!email || !password || !fullName || !age || !gender) {
      setMessage('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, {
        full_name: fullName,
        age: parseInt(age, 10),
        gender: gender,
      });

      if (error) {
        setMessage(`Error signing up: ${error.message}`);
      } else {
        setMessage('Sign up successful! Please check your email to confirm your account.');
        // Clear form
        setEmail('');
        setPassword('');
        setFullName('');
        setAge('');
        setGender('');
        // Switch to sign in mode
        setIsSignUp(false);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setMessage(`Error signing up: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    
    // Validate required fields
    if (!email || !password) {
      setMessage('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setMessage(`Error signing in: ${error.message}`);
      } else {
        setMessage('Successfully signed in! Redirecting...');
        // Clear form
        setEmail('');
        setPassword('');
        // The AuthContext will handle the redirect
      }
    } catch (error: any) {
      console.error('Signin error:', error);
      setMessage(`Error signing in: ${error.message || 'Please check your credentials and try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{isSignUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
          <CardDescription>{isSignUp ? 'Fill in the details to get started.' : 'Sign in to continue to CalmNest'}</CardDescription>
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
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
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
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            {message && <p className="text-center text-sm text-gray-300">{message}</p>}
            <div className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700" 
                  disabled={isLoading || loading}
                >
                  {isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                </Button>
                <Button onClick={() => setIsSignUp(!isSignUp)} variant="link" type="button" className="w-full text-purple-400 hover:text-purple-300">
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
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