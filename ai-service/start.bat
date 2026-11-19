@echo off
echo ============================================
echo  EduBridge AI - AI Service Startup
echo  FastAPI + Google Gemini on port 8000
echo ============================================
echo.

cd /d "%~dp0"

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Install Python 3.10+ and add to PATH.
    pause
    exit /b 1
)

REM Create venv if needed
if not exist "venv\Scripts\activate.bat" (
    echo [SETUP] Creating Python virtual environment...
    python -m venv venv
)

REM Activate venv
call venv\Scripts\activate.bat

REM Install dependencies
echo [SETUP] Installing dependencies...
pip install -q -r requirements.txt

REM Verify Gemini key
if not exist ".env" (
    echo [WARNING] .env file not found. Creating default...
    echo GEMINI_API_KEY=your-api-key-here > .env
    echo GEMINI_MODEL=gemini-2.5-flash >> .env
    echo [ACTION] Edit ai-service\.env and set your GEMINI_API_KEY
)

REM Free port 8000 if an existing AI service instance is running
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING 2^>nul') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo [START] Launching AI Service on http://localhost:8000
echo [INFO]  API docs: http://localhost:8000/docs
echo [INFO]  Health:   http://localhost:8000/health
echo.
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
