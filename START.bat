@echo off
echo ============================================
echo    Learning Portal - Complete Startup
echo ============================================
echo.

echo [1/4] Checking Python...
python --version
if errorlevel 1 (
    echo ERROR: Python not found! Please install Python 3.9+
    pause
    exit /b 1
)

echo.
echo [2/4] Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found! Please install Node.js
    pause
    exit /b 1
)

echo.
echo [3/4] Starting Backend Server...
echo Backend will run on http://localhost:8000
start "Learning Portal - Backend" cmd /k "cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload"

timeout /t 5 /nobreak > nul

echo.
echo [4/4] Starting Frontend Server...
echo Frontend will run on http://localhost:5173
start "Learning Portal - Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ============================================
echo    Servers Starting...
echo ============================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to open the application...
pause > nul

start http://localhost:5173

echo.
echo Application opened in browser!
echo.
echo To stop servers, close the terminal windows.
echo.
pause
