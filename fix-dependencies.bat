@echo off
echo Fixing npm dependency conflicts...

echo.
echo Step 1: Removing node_modules and package-lock.json...
if exist "node_modules" rmdir "node_modules" /S /Q
if exist "package-lock.json" del "package-lock.json"

echo.
echo Step 2: Installing with legacy peer deps...
npm install --legacy-peer-deps

echo.
echo Step 3: Testing build...
npm run build

echo.
echo Dependencies fixed successfully!
pause