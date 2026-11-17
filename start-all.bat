@echo off
echo ============================================================
echo   EduBridge AI - Full Stack Launcher
echo   Opens 3 terminals: AI Service, Backend, Frontend
echo ============================================================
echo.
echo [1/3] Starting AI Service (port 8000)...
start "EduBridge AI-Service" cmd /k "cd /d "%~dp0ai-service" && start.bat"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Spring Boot Backend (port 8080)...
start "EduBridge Backend" cmd /k "cd /d "%~dp0backend" && start.bat"

timeout /t 5 /nobreak >nul

echo [3/3] Starting Frontend Dev Server (port 3000)...
start "EduBridge Frontend" cmd /k "cd /d "%~dp0frontend" && start.bat"

echo.
echo All three services are launching in separate windows.
echo.
echo   Frontend:   http://localhost:3000
echo   Backend:    http://localhost:8080
echo   AI Service: http://localhost:8000
echo   AI Docs:    http://localhost:8000/docs
echo.
echo Demo accounts (no backend needed):
echo   Student:  student@edubridge.ai / Student@123
echo   Mentor:   mentor@edubridge.ai  / Mentor@123
echo.
pause
