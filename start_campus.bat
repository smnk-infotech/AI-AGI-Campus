@echo off
TITLE AI + AGI Campus Launcher

echo ===================================================
echo     STARTING AI + AGI CAMPUS SYSTEM
echo ===================================================

echo [1/5] Starting Backend Server (Port 8000)...
start "Backend API" cmd /k "call backend\api\.venv\Scripts\activate && set PYTHONPATH=. && python -m uvicorn backend.api.main:app --host 0.0.0.0 --port 8001 --reload"

echo [2/5] Starting Gateway Portal (Port 5173)...
start "Gateway Portal" cmd /k "cd frontend\homepage && npm run dev -- --host 0.0.0.0"

echo [3/5] Starting Student App (Port 5174)...
start "Student App" cmd /k "cd frontend\student_app && npm run dev -- --host 0.0.0.0"

echo [4/5] Starting Faculty App (Port 5175)...
start "Faculty App" cmd /k "cd frontend\faculty_app && npm run dev -- --host 0.0.0.0"

echo [5/5] Starting Admin App (Port 5177)...
start "Admin App" cmd /k "cd frontend\admin_app && npm run dev -- --host 0.0.0.0"

echo ===================================================
echo     ALL SYSTEMS GO! 🚀
echo ===================================================
echo Access the Unified Portal:
echo - Gateway: http://localhost:5173/portal
echo.
echo Credentials (Updated):
echo - Student: aarav.kumar@student.edu / password123
echo - Faculty: dr.gupta@faculty.edu / password123
echo - Admin:   admin@campus.edu / admin123
echo.
echo Direct Access (If needed):
echo - Student: http://localhost:5174
echo - Faculty: http://localhost:5175
echo - Admin:   http://localhost:5177
echo.
pause
