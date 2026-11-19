@echo off
echo ============================================
echo  EduBridge AI - Spring Boot Backend
echo  Port 8080 - Requires PostgreSQL
echo ============================================
echo.

REM Map virtual drive T: to avoid Unicode character path issues in JVM
if not exist "T:\" (
    subst T: "%~dp0.." >nul 2>&1
)

if exist "T:\backend" (
    cd /d "T:\backend"
) else (
    cd /d "%~dp0"
)

REM Verify Java
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java not found. Install JDK 21+ and add to PATH.
    pause
    exit /b 1
)

REM Check .env exists
if not exist ".env" (
    echo [ERROR] backend\.env file not found!
    pause
    exit /b 1
)

REM Free port 8080 if an existing backend instance is running
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080 ^| findstr LISTENING 2^>nul') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo [START] Launching Spring Boot on http://localhost:8080
echo.
java -jar target\backend-0.0.1-SNAPSHOT.jar
