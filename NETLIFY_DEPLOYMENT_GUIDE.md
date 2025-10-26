# 🚀 Netlify Deployment Guide - Database Connection Fix

## Problem: Website deployed but not connecting to database

Your website is deployed on Netlify but can't connect to the Flask backend database. Here's how to fix it:

## 🔧 Solution 1: Update API URLs for Production

### Step 1: Create Production Environment Variables

1. **Go to Netlify Dashboard**
   - Open your Netlify project
   - Go to **Site settings** → **Environment variables**

2. **Add these Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-flask-backend-url.com
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NODE_ENV=production
   ```

### Step 2: Deploy Flask Backend

Your Flask backend needs to be deployed separately. Options:

#### Option A: Deploy Flask on Railway/Render (Recommended)
1. **Railway.app** (Free tier available):
   - Connect your GitHub repo
   - Select `flask-backend` folder
   - Add environment variables:
     ```
     DATABASE_URL=your-postgresql-url
     ALLOWED_ORIGINS=https://your-netlify-site.netlify.app
     PORT=5001
     ```

#### Option B: Deploy Flask on Heroku
1. Create new Heroku app
2. Connect GitHub repo
3. Set buildpack to Python
4. Add environment variables

#### Option C: Use Supabase Database + Edge Functions
1. Replace Flask with Supabase Edge Functions
2. Use Supabase PostgreSQL database
3. Update frontend to use Supabase APIs

## 🔧 Solution 2: Update Frontend API Calls

Update all API calls to use environment variable:

```typescript
// Instead of: http://localhost:5001/api/...
// Use: ${process.env.NEXT_PUBLIC_API_URL}/api/...

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Example:
fetch(`${API_URL}/api/dashboard/${email}`)
```

## 🔧 Solution 3: Quick Fix - Use Supabase Only

If you want to avoid deploying Flask backend:

1. **Enable Supabase Authentication**
2. **Use Supabase Database** for storing user data
3. **Remove Flask dependencies**

## 📋 Immediate Action Items:

### 1. Deploy Flask Backend (Choose one):
- [ ] Railway.app deployment
- [ ] Render.com deployment  
- [ ] Heroku deployment
- [ ] Supabase Edge Functions

### 2. Update Environment Variables:
- [ ] Add NEXT_PUBLIC_API_URL to Netlify
- [ ] Add database credentials
- [ ] Update CORS settings in Flask

### 3. Update Frontend Code:
- [ ] Replace hardcoded localhost URLs
- [ ] Use environment variables for API calls
- [ ] Test production deployment

## 🚨 Current Issue:
Your frontend is trying to connect to `http://localhost:5001` which doesn't exist in production.

## 💡 Recommended Solution:
Deploy Flask backend on Railway.app (free) and update environment variables.

Would you like me to help you with any of these steps?