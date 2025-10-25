@echo off
echo ========================================
echo CalmNest Dashboard Issue Fix
echo ========================================
echo.

echo 🔧 Fixing database schema issues...
echo.

echo Step 1: Setting up database tables...
cd flask-backend
python setup_database.py
if errorlevel 1 (
    echo ❌ Database setup failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Running database migration...
python migrate_database.py
if errorlevel 1 (
    echo ❌ Database migration failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Testing Flask backend...
echo Starting Flask server for testing...
start "Flask Test" cmd /k "python app.py"

echo.
echo ========================================
echo Fix Applied Successfully! 
echo ========================================
echo.
echo Next Steps:
echo 1. Flask server is starting in a new window
echo 2. Wait for "Running on http://127.0.0.1:5001" message
echo 3. Start your Next.js frontend: cd CalmNest && npm run dev
echo 4. Test the dashboard with your user account
echo.
echo If you still see issues:
echo - Check Flask server logs for errors
echo - Verify database connection
echo - Check browser console for API errors
echo.
pause