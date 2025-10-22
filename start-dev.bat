@echo off
echo ========================================
echo Starting CalmNest Development Servers
echo ========================================
echo.

echo Starting Flask Backend Server...
start "Flask Backend" cmd /k "cd flask-backend && venv\Scripts\activate && python app.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Next.js Frontend Server...
start "Next.js Frontend" cmd /k "cd CalmNest && npm run dev"

echo.
echo ========================================
echo Development Servers Started!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5001
echo.
echo Press any key to close this window...
pause > nul