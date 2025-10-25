@echo off
echo Testing Comprehensive Assessment API...

echo.
echo 1. Creating new assessment...
curl -X POST http://127.0.0.1:5001/api/comprehensive-assessment -H "Content-Type: application/json" -d "{\"userId\": \"test-user-123\"}"

echo.
echo.
echo 2. Testing step update...
curl -X PUT http://127.0.0.1:5001/api/comprehensive-assessment/test-session-id/step -H "Content-Type: application/json" -d "{\"current_step\": \"phq9\", \"session_data\": {\"test\": \"data\"}}"

echo.
echo.
echo 3. Testing PHQ-9 save...
curl -X PUT http://127.0.0.1:5001/api/comprehensive-assessment/test-session-id/phq9 -H "Content-Type: application/json" -d "{\"score\": 15, \"severity\": \"Moderate\", \"answers\": [2,1,3,2,1,2,3,1,2]}"

echo.
echo.
echo Done!
pause