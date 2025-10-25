@echo off
echo Creating clean deployment branch...

echo.
echo Step 1: Creating new deployment branch...
git checkout -b deployment-clean

echo.
echo Step 2: Removing unnecessary files...
del *.bat
del *.html
del frontend-package.json
del next
del npm
del Build
del calm-nest@0.1.0

echo.
echo Step 3: Moving CalmNest files to root...
move "CalmNest\package.json" "package.json"
move "CalmNest\next.config.js" "next.config.js"
move "CalmNest\tsconfig.json" "tsconfig.json"
move "CalmNest\tailwind.config.js" "tailwind.config.js"
move "CalmNest\postcss.config.js" "postcss.config.js"
move "CalmNest\.eslintrc.json" ".eslintrc.json"

xcopy "CalmNest\src" "src" /E /H /Y /I
xcopy "CalmNest\public" "public" /E /H /Y /I

if exist "CalmNest\.env.local" move "CalmNest\.env.local" ".env.local"
if exist "CalmNest\.env.example" move "CalmNest\.env.example" ".env.example"

echo.
echo Step 4: Removing old CalmNest directory...
rmdir "CalmNest" /S /Q

echo.
echo Step 5: Committing clean structure...
git add .
git commit -m "Clean deployment structure - moved Next.js to root"

echo.
echo ========================================
echo   Clean deployment branch created!
echo ========================================
echo.
echo Now you can:
echo 1. Push this branch: git push origin deployment-clean
echo 2. Deploy from this branch on Netlify/Vercel
echo 3. Or merge to main: git checkout main && git merge deployment-clean
echo.
pause