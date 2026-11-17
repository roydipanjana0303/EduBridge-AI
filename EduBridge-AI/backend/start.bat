@echo off
echo ============================================================
echo  EduBridge AI - Spring Boot Backend Startup
echo ============================================================
cd /d "%~dp0"
echo Starting EduBridge Spring Boot backend on http://localhost:8080 ...
echo.
echo  IMPORTANT: PostgreSQL must be running on localhost:5432
echo  Database: edubridge  User: postgres  Password: postgres
echo  (Change these in backend/.env if needed)
echo.
echo  Endpoints after startup:
echo    POST http://localhost:8080/api/auth/register
echo    POST http://localhost:8080/api/auth/login
echo    GET  http://localhost:8080/api/auth/me
echo    GET  http://localhost:8080/api/chat/servers
echo    WS   ws://localhost:8080/ws
echo.
mvnw.cmd spring-boot:run
