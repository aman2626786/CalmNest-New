import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/'

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(new URL('/login?error=auth_callback_error', request.url))
      }

      console.log('Auth callback successful:', data.user?.email)
      
      // Set authentication cookies for middleware
      const response = NextResponse.redirect(new URL(redirectTo, request.url))
      
      if (data.user) {
        response.cookies.set('local_auth', 'authenticated', {
          path: '/',
          maxAge: 86400, // 24 hours
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production'
        })
        
        response.cookies.set('userEmail', data.user.email || '', {
          path: '/',
          maxAge: 86400, // 24 hours
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production'
        })

        // Create user profile in database if it doesn't exist
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
          const profileResponse = await fetch(`${apiUrl}/api/profile/${data.user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: data.user.email,
              full_name: data.user.user_metadata?.full_name || '',
              age: data.user.user_metadata?.age || null,
              gender: data.user.user_metadata?.gender || null
            })
          })

          if (profileResponse.ok) {
            console.log('User profile created/updated in database')
          } else {
            console.error('Failed to create/update user profile:', await profileResponse.text())
          }
        } catch (profileError) {
          console.error('Error creating user profile:', profileError)
        }
      }
      
      return response
    } catch (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      return NextResponse.redirect(new URL('/login?error=code_exchange_error', request.url))
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(new URL('/login?error=no_code', request.url))
}