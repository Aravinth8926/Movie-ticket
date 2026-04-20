@echo off
echo ========================================
echo   CineBook - System Diagnostics
echo ========================================
echo.

echo Checking required software...
echo.

echo [1] Java JDK
java -version >nul 2>&1
if %errorlevel% equ 0 (
    echo     ✓ Java is installed
    java -version 2>&1 | findstr "version"
) else (
    echo     ✗ Java is NOT installed
    echo     → Download from: https://adoptium.net/
)

echo.
echo [2] Maven
mvn --version >nul 2>&1
if %errorlevel% equ 0 (
    echo     ✓ Maven is installed
    mvn --version 2>&1 | findstr "Apache Maven"
) else (
    echo     ✗ Maven is NOT installed ^(THIS IS THE PROBLEM^)
    echo     → Download from: https://maven.apache.org/download.cgi
    echo     → Or install with: choco install maven
)

echo.
echo [3] MongoDB
mongod --version >nul 2>&1
if %errorlevel% equ 0 (
    echo     ✓ MongoDB is installed
    mongod --version 2>&1 | findstr "db version"
) else (
    echo     ✗ MongoDB is NOT installed
    echo     → Download from: https://www.mongodb.com/try/download/community
)

echo.
echo [4] Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo     ✓ Python is installed
    python --version
) else (
    echo     ✗ Python is NOT installed
    echo     → Download from: https://www.python.org/downloads/
)

echo.
echo ========================================
echo   Service Status
echo ========================================
echo.

echo [5] MongoDB Service
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    sc query MongoDB | find "RUNNING" >nul
    if %errorlevel% equ 0 (
        echo     ✓ MongoDB is RUNNING
    ) else (
        echo     ✗ MongoDB is NOT running
        echo     → Start with: net start MongoDB
    )
) else (
    tasklist | find "mongod.exe" >nul
    if %errorlevel% equ 0 (
        echo     ✓ MongoDB process is running
    ) else (
        echo     ✗ MongoDB is NOT running
        echo     → Start with: net start MongoDB
    )
)

echo.
echo [6] Backend (Port 8080)
netstat -ano | find ":8080" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo     ✓ Backend is RUNNING
) else (
    echo     ✗ Backend is NOT running ^(THIS IS WHY NO MOVIES SHOW^)
    echo     → Start with: cd backend ^&^& mvn spring-boot:run
)

echo.
echo [7] Frontend (Port 5500)
netstat -ano | find ":5500" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo     ✓ Frontend is RUNNING
) else (
    echo     ✗ Frontend is NOT running
    echo     → Start with: cd frontend ^&^& python -m http.server 5500
)

echo.
echo ========================================
echo   Summary
echo ========================================
echo.

set MISSING=0

java -version >nul 2>&1
if %errorlevel% neq 0 set /a MISSING+=1

mvn --version >nul 2>&1
if %errorlevel% neq 0 set /a MISSING+=1

mongod --version >nul 2>&1
if %errorlevel% neq 0 set /a MISSING+=1

if %MISSING% gtr 0 (
    echo ❌ You are missing %MISSING% required software
    echo.
    echo 📋 TO FIX:
    echo    1. Read INSTALL_REQUIREMENTS.md
    echo    2. Install missing software
    echo    3. Run this diagnostic again
) else (
    echo ✅ All required software is installed!
    echo.
    netstat -ano | find ":8080" | find "LISTENING" >nul
    if %errorlevel% neq 0 (
        echo ⚠️  But backend is not running
        echo.
        echo 📋 TO FIX:
        echo    1. Start MongoDB: net start MongoDB
        echo    2. Initialize database: mongosh ^< init-mongodb.js
        echo    3. Start backend: cd backend ^&^& mvn spring-boot:run
        echo    4. Refresh browser: http://localhost:5500
    ) else (
        echo 🎉 Everything is running!
        echo    Open: http://localhost:5500
    )
)

echo.
echo ========================================
echo.
pause
