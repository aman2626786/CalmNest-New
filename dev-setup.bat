@echo off
echo ========================================
echo CalmNest Development Environment Setup
echo ========================================
echo.

echo 1. Setting up Frontend (Next.js)...
cd CalmNest
echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo Error: Frontend dependency installation failed
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
cd ..

echo.
echo 2. Setting up Backend (Flask)...
cd flask-backend
echo Creating Python virtual environment...
python -m venv venv
if errorlevel 1 (
    echo Error: Virtual environment creation failed
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Python dependency installation failed
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy .env.example to .env.local in CalmNest folder
echo 2. Copy .env.example to .env in flask-backend folder
echo 3. Update environment variables with your credentials
echo 4. Run 'start-dev.bat' to start both servers
echo.
pause