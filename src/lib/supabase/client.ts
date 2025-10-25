import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate that we have the required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
  console.error('Get these values from: https://app.supabase.com/project/YOUR_PROJECT/settings/api')
}

// Only show warning in development if using placeholder values
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  if (supabaseUrl?.includes('your-project-ref') || supabaseAnonKey?.includes('your-anon-key')) {
    console.warn('⚠️ Please update your Supabase credentials in .env.local file')
    console.warn('Current URL:', supabaseUrl)
    console.warn('Get real credentials from: https://app.supabase.com/project/YOUR_PROJECT/settings/api')
  }
}

// Create Supabase client with actual credentials
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
)

export default supabase