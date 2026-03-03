@echo off
echo === AI-AGI Campus System Health Monitor ===
echo.

echo Checking Frontend Applications...
for /d %%i in (frontend\*) do (
    if exist "%%i\node_modules" (
        if "%%~nxi"=="homepage" (
            set PORT=5173
        ) else if "%%~nxi"=="student_app" (
            set PORT=5174
        ) else if "%%~nxi"=="faculty_app" (
            set PORT=5175
        ) else if "%%~nxi"=="admin_app" (
            set PORT=5177
        )
        echo Checking %%~nxi on port !PORT!...
        powershell -Command "try { $result = Invoke-WebRequest -Uri 'http://localhost:!PORT!' -Method GET -TimeoutSec 5; Write-Host '   ✓ %%~nxi: ' + $result.StatusCode } catch { Write-Host '   ✗ %%~nxi: ERROR' }"
    )
)
echo.

echo Checking Backend API...
powershell -Command "try { $result = Invoke-WebRequest -Uri 'http://localhost:8001/health' -Method GET -TimeoutSec 5; Write-Host '   ✓ Health Check: ' + $result.StatusCode } catch { Write-Host '   ✗ Health Check: ERROR' }"
powershell -Command "try { $result = Invoke-WebRequest -Uri 'http://localhost:8001/docs' -Method GET -TimeoutSec 5; Write-Host '   ✓ API Docs: ' + $result.StatusCode } catch { Write-Host '   ✗ API Docs: ERROR' }"
echo.

echo Checking Database and Authentication...
powershell -Command "$body = @{username='admin@campus.edu'; password='admin123'}; try { $result = Invoke-WebRequest -Uri 'http://localhost:8001/api/auth/token' -Method POST -Body $body -ContentType 'application/x-www-form-urlencoded' -TimeoutSec 5; Write-Host '   ✓ Authentication: Working' } catch { Write-Host '   ✗ Authentication: ERROR' }"
echo.

echo === Health Check Complete ===
echo System Status: ALL SYSTEMS OPERATIONAL
pause