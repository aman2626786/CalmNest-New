# CalmNest - Backend Manual

## 🚀 Backend Start Karne Ka Complete Guide

### Prerequisites
- Python 3.11+ installed
- Git Bash ya PowerShell access

---

## 📁 Project Structure
```
CalmNest/
├── flask-backend/          # Backend folder
│   ├── app.py              # Main Flask application
│   ├── .env                # Environment variables
│   ├── models.py           # Database models
│   └── requirements.txt    # Python dependencies
└── src/                    # Frontend folder
```

---

## 🔧 Step 1: Environment Setup

### 1.1 Navigate to Backend Folder
```bash
cd "E:\CalmNest\flask-backend"
```

### 1.2 Check Python Installation
```bash
python --version
# Should show: Python 3.11.x
```

### 1.3 Install Dependencies (if needed)
```bash
pip install flask flask-sqlalchemy flask-cors psycopg2-binary python-dotenv
```

---

## 🗄️ Step 2: Database Configuration

### 2.1 Check .env File
File: `flask-backend/.env`
```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5001

# Database Configuration - Using your Supabase database
DATABASE_URL=postgresql://postgres:%2A13579%2ASharma@db.lrvmsulryjwgrqwniltm.supabase.co:5432/postgres

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8888,http://localhost:8000

# Security
SECRET_KEY=your-secret-key-for-development
```

### 2.2 Database Options

#### Option A: Supabase Database (Original)
```env
DATABASE_URL=postgresql://postgres:%2A13579%2ASharma@db.lrvmsulryjwgrqwniltm.supabase.co:5432/postgres
```

#### Option B: Local SQLite (Backup)
```env
DATABASE_URL=sqlite:///mental_health.db
```

---

## ▶️ Step 3: Start Backend

### Method 1: Direct Python Command
```bash
cd "E:\CalmNest\flask-backend"
python app.py
```

### Method 2: With Environment Variable (PowerShell)
```powershell
cd "E:\CalmNest\flask-backend"
$env:DATABASE_URL="sqlite:///mental_health.db"; python app.py
```

### Method 3: With Environment Variable (CMD)
```cmd
cd "E:\CalmNest\flask-backend"
set DATABASE_URL=sqlite:///mental_health.db && python app.py
```

---

## ✅ Step 4: Verify Backend is Running

### 4.1 Check Terminal Output
You should see:
```
* Serving Flask app 'app'
* Debug mode: on
* Running on all addresses (0.0.0.0)
* Running on http://127.0.0.1:5001
* Running on http://172.16.3.17:5001
Press CTRL+C to quit
```

### 4.2 Test API Endpoints
Open browser or use curl:
```bash
# Test basic endpoint
curl http://localhost:5001/

# Test profile endpoint
curl http://localhost:5001/api/profile/email/devesh9667735720@gmail.com
```

---

## 👤 Step 5: Create User Accounts

### 5.1 Run User Creation Script
```bash
cd "E:\CalmNest\flask-backend"
python create_test_user.py
```

### 5.2 Manual User Creation (if needed)
```python
# Open Python shell
python

# Run this code:
from app import app, db
from models import Profile

with app.app_context():
    # Create your user
    user = Profile(
        id='your-user-id',
        email='your-email@gmail.com',
        full_name='Your Name',
        age=25,
        gender='Male'  # or 'Female'
    )
    
    db.session.add(user)
    db.session.commit()
    print(f"Created user: {user.email}")
```

---

## 🔍 Troubleshooting

### Problem 1: DNS Resolution Error
```
could not translate host name "db.lrvmsulryjwgrqwniltm.supabase.co"
```

**Solution:** Use SQLite fallback
```bash
$env:DATABASE_URL="sqlite:///mental_health.db"; python app.py
```

### Problem 2: Port Already in Use
```
Address already in use
```

**Solution:** Kill existing process
```bash
# Find process using port 5001
netstat -ano | findstr :5001

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Problem 3: Module Not Found
```
ModuleNotFoundError: No module named 'flask'
```

**Solution:** Install dependencies
```bash
pip install flask flask-sqlalchemy flask-cors psycopg2-binary python-dotenv
```

### Problem 4: Database Connection Failed
**Solution:** Check database URL and use fallback
```bash
# Test connection
python test_connection.py

# Use SQLite if Supabase fails
$env:DATABASE_URL="sqlite:///mental_health.db"; python app.py
```

---

## 🔄 Common Commands

### Start Backend (Quick)
```bash
cd "E:\CalmNest\flask-backend" && python app.py
```

### Start with SQLite
```powershell
cd "E:\CalmNest\flask-backend"
$env:DATABASE_URL="sqlite:///mental_health.db"; python app.py
```

### Create Users
```bash
cd "E:\CalmNest\flask-backend" && python create_test_user.py
```

### Stop Backend
```
Press Ctrl+C in terminal
```

---

## 📊 Database Management

### View SQLite Database
```bash
# Install SQLite browser or use command line
sqlite3 mental_health.db

# List tables
.tables

# View users
SELECT * FROM profile;

# Exit
.quit
```

### Reset Database
```bash
# Delete SQLite file
del mental_health.db

# Restart backend (will recreate tables)
python app.py
```

---

## 🌐 Frontend Connection

### Frontend Environment (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Test Frontend-Backend Connection
1. Start backend: `python app.py`
2. Start frontend: `npm run dev`
3. Try login with created user email

---

## 📝 Notes

1. **Always start backend before frontend**
2. **Backend runs on port 5001**
3. **Frontend connects to http://localhost:5001**
4. **SQLite database file: `mental_health.db`**
5. **Supabase connection may fail due to DNS issues**
6. **Use SQLite as reliable fallback**

---

## 🆘 Quick Help

### Backend Not Starting?
1. Check Python version: `python --version`
2. Install dependencies: `pip install -r requirements.txt`
3. Use SQLite: `$env:DATABASE_URL="sqlite:///mental_health.db"; python app.py`

### Can't Login?
1. Create user: `python create_test_user.py`
2. Check API: `curl http://localhost:5001/api/profile/email/YOUR_EMAIL`
3. Verify backend logs in terminal

### Database Issues?
1. Use SQLite: `$env:DATABASE_URL="sqlite:///mental_health.db"`
2. Reset database: `del mental_health.db`
3. Restart backend: `python app.py`

---

**Happy Coding! 🚀**