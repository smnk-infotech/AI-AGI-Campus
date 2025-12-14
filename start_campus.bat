@echo off
TITLE AI + AGI Campus Launcher

echo ===================================================
echo     STARTING AI + AGI CAMPUS SYSTEM
echo ===================================================

echo [1/4] Starting Backend Server (Port 8000)...
start "Backend API" cmd /k "call backend\api\.venv\Scripts\activate && set PYTHONPATH=. && python -m uvicorn backend.api.main:app --reload"

echo [2/4] Starting Student App (Port 5174)...
start "Student App" cmd /k "cd frontend\student_app && npm run dev"

echo [3/4] Starting Faculty App (Port 5175)...
start "Faculty App" cmd /k "cd frontend\faculty_app && npm run dev"

echo [4/4] Starting Admin App (Port 5177)...
start "Admin App" cmd /k "cd frontend\admin_app && npm run dev"

echo ===================================================
echo     ALL SYSTEMS GO! 🚀
echo ===================================================
echo Access the apps:
echo - Student: http://localhost:5174
echo - Faculty: http://localhost:5175
echo - Admin:   http://localhost:5177
echo.
pause
