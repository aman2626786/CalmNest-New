@echo off
echo Testing local build for Netlify deployment...

cd CalmNest

echo.
echo 1. Installing dependencies...
npm install

echo.
echo 2. Building project...
npm run build

echo.
echo 3. Checking output directory...
dir out

echo.
echo 4. Starting local server to test...
echo You can test the build by running: npx serve out
echo.

pause