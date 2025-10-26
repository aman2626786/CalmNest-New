import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/profile-setup',
  '/appointments',
  '/comprehensive-assessment',
  '/forum/new',
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

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get the pathname
  const pathname = req.nextUrl.pathname;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));

  // If it's a public route, allow access
  if (isPublicRoute && !isProtectedRoute) {
    return res;
  }

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If no session, redirect to login (email confirmation optional)
    if (!session || !session.user) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

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
