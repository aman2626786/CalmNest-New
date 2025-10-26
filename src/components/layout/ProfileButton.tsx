'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, Trash2, Sun, Moon, Laptop, Edit } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // Use the central auth context

export function ProfileButton() {
  const { setTheme } = useTheme();
  const router = useRouter();
  const { user, signOut, loading } = useAuth(); // Get user and signOut from context

  const handleSignOut = async () => {
    console.log('🔄 Signing out user...');
    await signOut();
    console.log('✅ User signed out');
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      try {
        // Note: This fetch call might need to be adjusted if your backend expects a real UUID
        const response = await fetch(`http://localhost:5001/api/profile/${user.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          console.log('✅ Account deleted from backend');
        }
        
        // Sign out from context
        await signOut();
        alert('Account deleted successfully.');
        router.push('/');
      } catch (error) {
        console.error('❌ Account deletion error:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  // Show a placeholder or nothing while loading
  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse" />
    );
  }

  if (!user) {
    return (
        <Button asChild variant="outline" size="sm" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
            <Link href="/login">Login</Link>
        </Button>
    );
  }

  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim()) {
      const names = name.trim().split(' ');
      if (names.length >= 2) {
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    return email ? email.charAt(0).toUpperCase() : '?';
  };

  const getUserDisplayName = () => {
    const fullName = user?.user_metadata?.full_name;
    if (fullName && fullName.trim()) {
      return fullName;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-purple-600 text-white">
                    {getInitials(user?.user_metadata?.full_name, user?.email || '')}
                </AvatarFallback>
            </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              Age: {user.user_metadata?.age} • {user.user_metadata?.gender}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile-setup">
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />
                <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        <Laptop className="mr-2 h-4 w-4" />
                        <span>System</span>
                    </DropdownMenuItem>
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteAccount} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete Account</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}