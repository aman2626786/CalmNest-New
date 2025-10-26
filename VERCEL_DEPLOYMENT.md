# 🚀 Vercel Deployment Guide (Recommended)

## Why Vercel?
- ✅ Next.js के साथ perfect integration
- ✅ Automatic deployments from GitHub
- ✅ Built-in API routes support
- ✅ Free tier with good limits
- ✅ No separate backend deployment needed

## Step 1: Convert Flask to Next.js API Routes

### Create API Routes:
```
pages/api/
├── dashboard/[email].js
├── forum/index.js
├── forum/new.js
├── comprehensive-assessment/
│   ├── index.js
│   └── [sessionId]/
│       ├── phq9.js
│       ├── gad7.js
│       └── complete.js
└── feedback.js
```

### Example API Route:
```javascript
// pages/api/dashboard/[email].js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const { email } = req.query;
  
  if (req.method === 'GET') {
    try {
      // Your dashboard logic here
      const result = await pool.query('SELECT * FROM profiles WHERE email = $1', [email]);
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

## Step 2: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Add Environment Variables:**
   - Go to Vercel Dashboard
   - Add: `DATABASE_URL=your-postgres-url`

## Step 3: Update Frontend API Calls

Update `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-vercel-app.vercel.app
```

## 🎯 Quick Setup Commands:

```bash
# 1. Install Vercel
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod

# 4. Add environment variables in Vercel dashboard
```

## Benefits:
- ✅ Same domain for frontend and backend
- ✅ No CORS issues
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions