@echo off
echo Setting up GitHub repository...
echo.
echo Please create a repository on GitHub first, then run this script with the repository URL
echo Example: setup-github.bat https://github.com/username/repository-name.git
echo.

if "%1"=="" (
    echo Error: Please provide the GitHub repository URL as an argument
    echo Usage: setup-github.bat https://github.com/username/repository-name.git
    pause
    exit /b 1
)

echo Adding remote origin: %1
git remote add origin %1

echo Setting main branch...
git branch -M main

echo Pushing to GitHub...
git push -u origin main

echo.
echo Repository successfully uploaded to GitHub!
echo Repository URL: %1
pause