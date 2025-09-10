@echo off
echo Starting VisionX Development Servers...
echo =====================================

cd %~dp0

REM Start Backend Server
echo Starting Backend Server...
cd server
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)
start cmd /k "npm run dev"

REM Wait a bit for backend to start
timeout /t 5 /nobreak > nul

REM Start Frontend Server
echo Starting Frontend Server...
cd ../client
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)
start cmd /k "npm run dev"

echo =====================================
echo Servers are starting...
echo - Backend will run on http://localhost:10000
echo - Frontend will run on http://localhost:5173
echo.
echo You can close this window. To stop the servers,
echo close their respective command prompt windows.
echo =====================================
pause
