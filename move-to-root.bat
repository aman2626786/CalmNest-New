@echo off
echo Moving CalmNest files to root directory for easier deployment...

echo.
echo WARNING: This will move all files from CalmNest folder to root directory.
echo Make sure you have committed all changes to git first!
echo.
pause

echo Moving files...
xcopy "CalmNest\*" "." /E /H /Y /I

echo.
echo Files moved successfully!
echo Now you can deploy directly from root directory.
echo.
pause