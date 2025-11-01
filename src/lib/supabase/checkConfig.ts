/**
 * Supabase Configuration Checker
 * This file helps diagnose Supabase connection issues
 */

export function checkSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const issues: string[] = [];
  const warnings: string[] = [];

  // Check if credentials exist
  if (!url) {
    issues.push('❌ NEXT_PUBLIC_SUPABASE_URL is missing in .env.local');
  }
  if (!key) {
    issues.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in .env.local');
  }

  // Check if credentials are dummy/placeholder
  if (url) {
    if (url.includes('demo') || url.includes('placeholder') || url.includes('pqrxwvutsrqponmlkjih')) {
      issues.push('❌ NEXT_PUBLIC_SUPABASE_URL contains dummy/placeholder value');
      issues.push('   Please replace with your real Supabase project URL');
    }
    if (!url.includes('.supabase.co')) {
      warnings.push('⚠️  NEXT_PUBLIC_SUPABASE_URL does not look like a valid Supabase URL');
    }
  }

  if (key) {
    if (key.includes('demo') || key.includes('placeholder') || key.includes('working-demo-key')) {
      issues.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY contains dummy/placeholder value');
      issues.push('   Please replace with your real Supabase anon key');
    }
    if (!key.startsWith('eyJ')) {
      warnings.push('⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY does not look like a valid JWT token');
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    url,
    hasKey: !!key
  };
}

export function logSupabaseStatus() {
  if (typeof window === 'undefined') return; // Only run in browser

  const config = checkSupabaseConfig();

  console.group('🔍 Supabase Configuration Check');
  
  if (config.isValid) {
    console.log('✅ Supabase is properly configured!');
    console.log('📍 URL:', config.url);
    console.log('🔑 Key:', config.hasKey ? 'Present' : 'Missing');
  } else {
    console.error('❌ Supabase Configuration Issues Found:');
    config.issues.forEach(issue => console.error(issue));
  }

  if (config.warnings.length > 0) {
    console.warn('⚠️  Warnings:');
    config.warnings.forEach(warning => console.warn(warning));
  }

  if (!config.isValid) {
    console.log('\n📖 Setup Instructions:');
    console.log('1. Go to https://supabase.com and create a project');
    console.log('2. Copy your Project URL and Anon Key from Settings → API');
    console.log('3. Update .env.local file with real credentials');
    console.log('4. Restart your development server');
    console.log('\nSee SUPABASE_SETUP_GUIDE.md for detailed instructions');
  }

  console.groupEnd();
}
