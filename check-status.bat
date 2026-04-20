@echo off
echo ========================================
echo   CineBook - System Status Check
echo ========================================
echo.

echo [1] Checking MongoDB...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo     ✓ MongoDB service found
    sc query MongoDB | find "RUNNING" >nul
    if %errorlevel% equ 0 (
        echo     ✓ MongoDB is RUNNING
    ) else (
        echo     ✗ MongoDB is NOT running
        echo     → Run: net start MongoDB
    )
) else (
    echo     ✗ MongoDB service not found
    echo     → MongoDB may not be installed
    tasklist | find "mongod.exe" >nul
    if %errorlevel% equ 0 (
        echo     ✓ But mongod.exe process is running
    ) else (
        echo     ✗ MongoDB is not running at all
        echo     → Install MongoDB or start it manually
    )
)

echo.
echo [2] Checking Backend (Port 8080)...
netstat -ano | find ":8080" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo     ✓ Backend is RUNNING on port 8080
) else (
    echo     ✗ Backend is NOT running
    echo     → Run: cd backend ^&^& mvn spring-boot:run
)

echo.
echo [3] Checking Frontend (Port 5500)...
netstat -ano | find ":5500" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo     ✓ Frontend is RUNNING on port 5500
) else (
    echo     ✗ Frontend is NOT running
    echo     → Run: cd frontend ^&^& python -m http.server 5500
)

echo.
echo [4] Testing Backend API...
curl -s http://localhost:8080/api/movies >nul 2>&1
if %errorlevel% equ 0 (
    echo     ✓ Backend API is responding
) else (
    echo     ✗ Backend API is not responding
    echo     → Make sure backend is running and MongoDB has data
)

echo.
echo ========================================
echo   Status Check Complete
echo ========================================
echo.
echo Next Steps:
echo 1. If MongoDB is not running: net start MongoDB
echo 2. If Backend is not running: cd backend ^&^& mvn spring-boot:run
echo 3. If Frontend is not running: cd frontend ^&^& python -m http.server 5500
echo 4. If no data: Run MongoDB initialization script
echo.
echo For detailed help, see TROUBLESHOOTING.md
echo.
pause
