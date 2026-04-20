@echo off
echo ========================================
echo   CineBook - Starting Backend Server
echo ========================================
echo.

cd backend

echo Checking if MongoDB is running...
sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
    echo MongoDB is not running. Starting MongoDB...
    net start MongoDB
    timeout /t 3 >nul
) else (
    echo MongoDB is already running.
)

echo.
echo Building and starting Spring Boot application...
echo This may take a few minutes on first run...
echo.

call mvn clean install
if errorlevel 1 (
    echo.
    echo ERROR: Maven build failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo Starting Spring Boot application...
echo Backend will be available at http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.

call mvn spring-boot:run

pause
