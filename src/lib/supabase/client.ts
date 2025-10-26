import { createClient } from '@supabase/supabase-js'

// Fallback config checker for production builds
const checkSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const issues: string[] = [];
  
  if (!url || url.includes('demo') || url.includes('placeholder')) {
    issues.push('Supabase URL not configured');
  }
  if (!key || key.includes('demo') || key.includes('placeholder')) {
    issues.push('Supabase key not configured');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    warnings: []
  };
};

const logSupabaseStatus = () => {
  if (typeof window !== 'undefined') {
    console.log('Supabase status check completed');
  }
};

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check configuration
const config = checkSupabaseConfig()

// Check if we have real Supabase credentials
const hasRealCredentials = config.isValid && 
                          supabaseUrl && 
                          supabaseAnonKey && 
                          supabaseUrl.includes('.supabase.co')

// Temporary fallback to local auth if Supabase not available
const forceLocalAuth = !hasRealCredentials

// Create Supabase client
export const supabase = hasRealCredentials 
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        headers: {
          'X-Client-Info': 'calmnest-app'
        }
      }
    })
  : createClient('https://dummy.supabase.co', 'dummy-key') // Dummy client - will fail

// Export helper to check if Supabase is available
export const isSupabaseAvailable = () => hasRealCredentials && !forceLocalAuth

// Log the status in browser
if (typeof window !== 'undefined') {
  logSupabaseStatus()
  
  if (!hasRealCredentials) {
    console.error('🚨 SUPABASE NOT CONFIGURED PROPERLY! 🚨')
    console.error('Authentication will NOT work until you set up real Supabase credentials.')
    console.error('See SUPABASE_SETUP_GUIDE.md for instructions.')
  }
}

export default supabase