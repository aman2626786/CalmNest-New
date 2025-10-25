# CalmNest Deployment Guide

## Prerequisites
- Node.js 18+ 
- Python 3.11+
- PostgreSQL database
- Supabase account (for authentication)

## Environment Setup

### 1. Frontend (.env.local in CalmNest folder)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### 2. Backend (.env in flask-backend folder)
```
DATABASE_URL=postgresql://username:password@host:port/database_name
FLASK_ENV=production
FLASK_DEBUG=False
PORT=5001
ALLOWED_ORIGINS=https://your-frontend-domain.com
SECRET_KEY=your-secret-key
```

## Deployment Options

### Option 1: Vercel (Frontend) + Heroku (Backend)

#### Frontend on Vercel:
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically

#### Backend on Heroku:
1. Create Heroku app
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy from GitHub

### Option 2: Docker Deployment
```bash
# Clone repository
git clone https://github.com/aman2626786/CalmNest-New.git
cd CalmNest-New

# Set environment variables
cp flask-backend/.env.example flask-backend/.env
cp CalmNest/.env.example CalmNest/.env.local

# Edit .env files with your configuration

# Run with Docker Compose
docker-compose up -d
```

### Option 3: Manual Deployment

#### Backend:
```bash
cd flask-backend
pip install -r requirements.txt
python app.py
```

#### Frontend:
```bash
cd CalmNest
npm install
npm run build
npm start
```

## Database Setup
The Flask app will automatically create tables on first run.

## Important Notes
- Update CORS origins in backend for production domains
- Use environment variables for all sensitive data
- Set up proper SSL certificates for HTTPS
- Configure database backups
- Monitor application logs

## Testing Deployment
1. Test authentication flow
2. Test profile creation/update
3. Test comprehensive assessment
4. Test dashboard data loading
5. Test all API endpoints

## Troubleshooting
- Check CORS configuration if API calls fail
- Verify database connection string
- Ensure all environment variables are set
- Check application logs for errors