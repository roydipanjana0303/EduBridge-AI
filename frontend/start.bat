@echo off
echo ============================================
echo  EduBridge AI - Frontend Dev Server
echo  React + Vite on http://localhost:3000
echo ============================================
echo.

REM Map virtual drive T: to avoid Unicode character path issues in Node/Vite
if not exist "T:\" (
    subst T: "%~dp0.." >nul 2>&1
)

if exist "T:\frontend" (
    cd /d "T:\frontend"
) else (
    cd /d "%~dp0"
)

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Install Node 18+ from https://nodejs.org
    pause
    exit /b 1
)

REM Kill any previous zombie vite instances on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING 2^>nul') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo [START] Starting Vite dev server on http://localhost:3000
echo [INFO]  Proxying /api to http://localhost:8080
echo [INFO]  Proxying /ws  to ws://localhost:8080
echo.
call npm run dev
