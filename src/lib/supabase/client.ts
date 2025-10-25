import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have real Supabase credentials
const hasRealCredentials = supabaseUrl && 
                          supabaseAnonKey && 
                          !supabaseUrl.includes('demo') && 
                          !supabaseUrl.includes('placeholder') &&
                          !supabaseAnonKey.includes('demo') &&
                          !supabaseAnonKey.includes('placeholder') &&
                          supabaseUrl.includes('.supabase.co')

// Create Supabase client - use dummy client if no real credentials
export const supabase = hasRealCredentials 
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createClient('https://dummy.supabase.co', 'dummy-key') // Dummy client for compatibility

// Export helper to check if Supabase is available
export const isSupabaseAvailable = () => hasRealCredentials

// Log the status
if (typeof window !== 'undefined') {
  if (hasRealCredentials) {
    console.log('✅ Supabase client initialized with real credentials')
  } else {
    console.log('⚠️ Supabase not available - using local authentication fallback')
  }
}

export default supabase