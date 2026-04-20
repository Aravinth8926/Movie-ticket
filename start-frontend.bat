@echo off
echo ========================================
echo   CineBook - Starting Frontend Server
echo ========================================
echo.

cd frontend

echo Starting frontend server on port 5500...
echo Frontend will be available at http://localhost:5500
echo.
echo Press Ctrl+C to stop the server
echo.

python -m http.server 5500

pause
