@echo off
echo ============================================================
echo  EduBridge AI - Frontend Dev Server Startup
echo ============================================================
cd /d "%~dp0"
echo Starting Vite dev server on http://localhost:3000 ...
echo.
echo  Demo accounts (no backend needed):
echo    Student : student@edubridge.ai  /  Student@123
echo    Mentor  : mentor@edubridge.ai   /  Mentor@123
echo.
npm run dev
