# Netlify Deployment Guide for CalmNest

## Issue: Page Not Found (404 Error)

The "Page not found" error on Netlify typically occurs because:
1. Netlify doesn't understand Next.js client-side routing
2. Missing redirect configuration
3. Incorrect build settings

## Solution Steps:

### 1. Netlify Dashboard Settings
Go to your Netlify site dashboard and update:

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `18`

### 2. Environment Variables
Add these in Netlify dashboard under "Environment variables":
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_backend_url
```

### 3. Deploy Backend First
Before deploying frontend, make sure your Flask backend is deployed on:
- Heroku
- Railway
- Render
- Or any other platform

Update `NEXT_PUBLIC_API_URL` with your backend URL.

### 4. Redeploy
After making these changes:
1. Commit and push to GitHub
2. Netlify will auto-deploy
3. Or manually trigger deploy in Netlify dashboard

## Alternative: Use Vercel Instead
Vercel has better Next.js support out of the box:

1. Connect GitHub repo to Vercel
2. Add environment variables
3. Deploy automatically

## Troubleshooting:
- Check Netlify build logs for errors
- Verify all environment variables are set
- Ensure backend is running and accessible
- Test locally first with `npm run build && npm start`

## Backend Deployment Options:
- **Railway**: Easy deployment, good free tier
- **Render**: Simple setup, automatic deployments
- **Heroku**: Reliable but no free tier
- **DigitalOcean**: More control, affordable