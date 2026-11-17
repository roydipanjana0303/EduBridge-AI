@echo off
echo ============================================================
echo  EduBridge AI - AI Service Startup
echo ============================================================
cd /d "%~dp0"
echo [1/3] Activating Python virtual environment...
call .venv\Scripts\activate.bat 2>nul || (
    echo No .venv found. Creating one...
    python -m venv .venv
    call .venv\Scripts\activate.bat
)
echo [2/3] Installing/upgrading dependencies...
pip install -q -r requirements.txt
echo [3/3] Starting FastAPI AI service on http://localhost:8000 ...
echo.
echo  Endpoints:
echo    GET  http://localhost:8000/health
echo    POST http://localhost:8000/llm/chat
echo    POST http://localhost:8000/ai/chat
echo    GET  http://localhost:8000/docs  (Swagger UI)
echo.
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
