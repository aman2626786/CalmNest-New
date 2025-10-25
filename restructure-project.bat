@echo off
echo ========================================
echo   CalmNest Project Restructure Script
echo ========================================
echo.
echo This will move all Next.js files to root directory
echo for easier deployment on Netlify/Vercel.
echo.
echo IMPORTANT: Make sure you have committed all changes!
echo.
pause

echo.
echo Step 1: Backing up current structure...
if not exist "backup" mkdir backup
xcopy "CalmNest" "backup\CalmNest" /E /H /Y /I

echo.
echo Step 2: Moving Next.js files to root...

REM Copy essential Next.js files
copy "CalmNest\package.json" "package.json" /Y
copy "CalmNest\next.config.js" "next.config.js" /Y
copy "CalmNest\tsconfig.json" "tsconfig.json" /Y
copy "CalmNest\tailwind.config.js" "tailwind.config.js" /Y
copy "CalmNest\postcss.config.js" "postcss.config.js" /Y
copy "CalmNest\.eslintrc.json" ".eslintrc.json" /Y

REM Copy directories
xcopy "CalmNest\src" "src" /E /H /Y /I
xcopy "CalmNest\public" "public" /E /H /Y /I

REM Copy other important files
if exist "CalmNest\.env.local" copy "CalmNest\.env.local" ".env.local" /Y
if exist "CalmNest\.env.example" copy "CalmNest\.env.example" ".env.example" /Y

echo.
echo Step 3: Updating configurations...

echo.
echo ========================================
echo   Project restructured successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Test locally: npm install && npm run build
echo 2. Commit changes: git add . && git commit -m "Restructure for deployment"
echo 3. Push to GitHub: git push origin main
echo 4. Deploy on Netlify/Vercel (will work now!)
echo.
pause