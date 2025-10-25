# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub/Google or create account
4. Click "New Project"
5. Choose organization (create one if needed)
6. Fill project details:
   - Name: `calmnest-mental-health`
   - Database Password: (create a strong password)
   - Region: Choose closest to your users
7. Click "Create new project"
8. Wait for project to be ready (2-3 minutes)

## Step 2: Get API Credentials

1. Go to your project dashboard
2. Click on "Settings" (gear icon) in left sidebar
3. Click on "API" 
4. Copy the following values:

### Project URL
```
https://your-project-ref.supabase.co
```

### Anon Key (public)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Update Environment Variables

1. Open `.env.local` file in your project root
2. Replace the placeholder values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here

# Development Environment
NODE_ENV=development
```

## Step 4: Set up Authentication

1. In Supabase dashboard, go to "Authentication" > "Settings"
2. Configure:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your production URL when deploying
3. Enable email confirmations if desired
4. Configure email templates (optional)

## Step 5: Create User Profiles Table (Optional)

If you want to store additional user data:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  age integer,
  gender text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policy for users to see their own profile
create policy "Users can view own profile" 
  on profiles for select 
  using ( auth.uid() = id );

-- Create policy for users to update their own profile
create policy "Users can update own profile" 
  on profiles for update 
  using ( auth.uid() = id );
```

## Step 6: Configure Netlify Environment Variables

For production deployment on Netlify:

1. Go to Netlify dashboard
2. Select your site
3. Go to "Site settings" > "Environment variables"
4. Add the same environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 7: Test Authentication

1. Restart your development server: `npm run dev`
2. Go to `/login` page
3. Try signing up with a real email
4. Check your email for confirmation link
5. After confirmation, you should be able to sign in

## Troubleshooting

### "Invalid API key" error
- Double-check your API key is correct
- Make sure you're using the "anon" key, not the "service_role" key

### Email not sending
- Check Supabase Auth settings
- Verify email templates are configured
- For production, configure custom SMTP (optional)

### CORS errors
- Add your domain to allowed origins in Supabase Auth settings

## Security Notes

- Never commit real API keys to version control
- Use environment variables for all sensitive data
- The anon key is safe to use in frontend (it's public)
- Service role key should NEVER be used in frontend code