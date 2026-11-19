@echo off
if not exist "T:\" (
    subst T: "%~dp0.." >nul 2>&1
)
cd /d "%~dp0"
call mvnw.cmd package -DskipTests
