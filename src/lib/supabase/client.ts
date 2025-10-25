import { createClient } from '@supabase/supabase-js'

// Default dummy values for development when environment variables are not set
const DEFAULT_SUPABASE_URL = 'https://dummy-project.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15LXByb2plY3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NjA2NzI2MCwiZXhwIjoxOTYxNjQzMjYwfQ.dummy-key-for-development'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

// Only show warning in development and if using dummy values
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  if (supabaseUrl === DEFAULT_SUPABASE_URL) {
    console.warn('⚠️ Using dummy Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
  }
}

// Ensure we always have valid values for createClient
const validUrl = supabaseUrl || DEFAULT_SUPABASE_URL
const validKey = supabaseAnonKey || DEFAULT_SUPABASE_ANON_KEY

export const supabase = createClient(validUrl, validKey)

export default supabase