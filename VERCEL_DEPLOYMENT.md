# Vercel Deployment Guide (Recommended)

## Why Vercel is Better for Next.js

Vercel is made by the creators of Next.js and has native support. Netlify requires complex configuration for Next.js SSR.

## Quick Vercel Deployment:

### 1. Go to Vercel.com
- Sign up with GitHub account
- Import your repository: `aman2626786/CalmNest-New`

### 2. Configure Project
- Framework Preset: **Next.js**
- Root Directory: **CalmNest**
- Build Command: `npm run build`
- Output Directory: Leave empty (auto-detected)

### 3. Environment Variables
Add these in Vercel dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_backend_url
```

### 4. Deploy Backend
Use Railway for Flask backend:
1. Go to Railway.app
2. Connect GitHub repo
3. Select `flask-backend` folder
4. Add environment variables:
   ```
   DATABASE_URL=your_postgres_url
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```

### 5. Update Frontend
After backend deployment, update `NEXT_PUBLIC_API_URL` in Vercel with your Railway backend URL.

## Benefits of Vercel:
- ✅ Native Next.js support
- ✅ Automatic deployments
- ✅ No configuration needed
- ✅ Better performance
- ✅ Free tier available

## Alternative: Fix Netlify
If you want to stick with Netlify, the current configuration should work with static export, but you'll lose some Next.js features like SSR.