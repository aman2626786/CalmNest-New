@echo off
echo ========================================
echo Testing CalmNest Dashboard API
echo ========================================
echo.

echo 🔍 Step 1: Checking what data exists in database...
cd flask-backend
python debug_user_data.py

echo.
echo 🧪 Step 2: Testing API endpoints...
echo.

echo Testing if Flask server is running...
curl -s http://127.0.0.1:5001/ > nul
if errorlevel 1 (
    echo ❌ Flask server is not running!
    echo Please start Flask server first: python app.py
    pause
    exit /b 1
) else (
    echo ✅ Flask server is running
)

echo.
echo 📊 Testing dashboard endpoints...
echo.

echo Testing unified dashboard endpoint...
echo (This will show if the endpoint works)
curl -s "http://127.0.0.1:5001/api/dashboard/unified/test-user/devesh9667735720@gmail.com"

echo.
echo.
echo ========================================
echo Test Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Check the output above for any data
echo 2. If you see data, the API is working
echo 3. If no data, we need to check user ID mapping
echo 4. Start your Next.js app and test dashboard
echo.
pause