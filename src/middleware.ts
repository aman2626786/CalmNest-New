import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/profile',
  '/profile-setup',
  '/comprehensive-assessment',
  '/forum/new',
  // '/dashboard', // Temporarily disabled to fix redirect loop
];

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/auth/callback',
  '/resources',
  '/exercises',
  '/guided-breathing',
  '/music-therapy',
  '/mood-groove',
  '/forum',
  '/self-check',
];

// Check if using local auth (development mode)
function isLocalAuth() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !supabaseUrl || 
         supabaseUrl.includes('your-project-ref') || 
         supabaseUrl.includes('placeholder');
}

// Check local authentication from cookies
function checkLocalAuth(req: NextRequest) {
  // In local auth mode, we'll check for a simple auth cookie
  const authCookie = req.cookies.get('local_auth');
  return authCookie?.value === 'authenticated';
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;
  
  console.log('Middleware: Processing request for:', pathname);

  // Handle auth callback route specially
  if (pathname.startsWith('/auth/callback')) {
    return res;
  }

  // Check if the route requires authentication
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    let isAuthenticated = false;

    // Check local auth first (cookie-based)
    const localAuthResult = checkLocalAuth(req);
    console.log('Middleware: Local auth check result:', localAuthResult);

    if (localAuthResult) {
      isAuthenticated = true;
      console.log('Middleware: Authenticated via local auth');
    } else {
      // If local auth fails, try Supabase auth
      console.log('Middleware: Checking Supabase auth');
      try {
        const supabase = createMiddlewareClient({ req, res });
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Middleware: Session error:', error);
        }
        
        isAuthenticated = !!session;
        console.log('Middleware: Supabase auth result:', isAuthenticated);
      } catch (error) {
        console.error('Middleware: Supabase auth error:', error);
        isAuthenticated = false;
      }
    }

    if (!isAuthenticated) {
      // Not authenticated, redirect to login
      console.log('Middleware: Redirecting to login, not authenticated');
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // For public routes or authenticated users, continue
  console.log('Middleware: Allowing access to:', pathname);
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
