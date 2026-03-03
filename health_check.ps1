Write-Host "=== AI-AGI Campus System Health Monitor ===" -ForegroundColor Cyan
Write-Host ""

$failed = $false

function Test-Http {
    param(
        [Parameter(Mandatory=$true)][string]$Name,
        [Parameter(Mandatory=$true)][string]$Url,
        [int]$TimeoutSec = 5
    )

    Write-Host "   Checking $Name..." -NoNewline
    try {
        $result = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec $TimeoutSec -UseBasicParsing -ErrorAction Stop
        $status = [int]$result.StatusCode
        if ($status -ge 200 -and $status -lt 400) {
            Write-Host " [OK] $status" -ForegroundColor Green
            return $true
        }
        Write-Host " [FAIL] $status" -ForegroundColor Red
        return $false
    } catch {
        $msg = $_.Exception.Message
        if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "Request failed" }
        Write-Host " [FAIL] ERROR ($msg)" -ForegroundColor Red
        return $false
    }
}

Write-Host "1. Frontend Applications:" -ForegroundColor Yellow
$frontendPorts = [ordered]@{
    homepage    = 5173
    student_app = 5174
    faculty_app = 5175
    admin_app   = 5177
}

foreach ($kvp in $frontendPorts.GetEnumerator()) {
    $app = $kvp.Key
    $port = $kvp.Value
    $ok = Test-Http -Name "$app on port $port" -Url "http://127.0.0.1:$port/" -TimeoutSec 8
    if (-not $ok) { $failed = $true }
}

Write-Host ""
Write-Host "2. Backend API:" -ForegroundColor Yellow
$ok = Test-Http -Name "Health Endpoint" -Url "http://127.0.0.1:8001/health" -TimeoutSec 8
if (-not $ok) { $failed = $true }

$ok = Test-Http -Name "API Documentation" -Url "http://127.0.0.1:8001/docs" -TimeoutSec 8
if (-not $ok) { $failed = $true }

Write-Host ""
Write-Host "3. Database & Authentication:" -ForegroundColor Yellow
Write-Host "   Checking Authentication..." -NoNewline
$body = @{ username = "admin@campus.edu"; password = "admin123" }
try {
    $result = Invoke-WebRequest -Uri "http://127.0.0.1:8001/api/auth/token" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded" -TimeoutSec 8 -UseBasicParsing -ErrorAction Stop
    if ([int]$result.StatusCode -ge 200 -and [int]$result.StatusCode -lt 400) {
        $json = $null
        try { $json = $result.Content | ConvertFrom-Json } catch { $json = $null }
        if ($null -ne $json -and $null -ne $json.access_token -and $json.access_token.Length -gt 0) {
            Write-Host " [OK] Working" -ForegroundColor Green
        } else {
            Write-Host " [FAIL] ERROR (Missing access_token)" -ForegroundColor Red
            $failed = $true
        }
    } else {
        Write-Host " [FAIL] $([int]$result.StatusCode)" -ForegroundColor Red
        $failed = $true
    }
} catch {
    $msg = $_.Exception.Message
    if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "Request failed" }
    Write-Host " [FAIL] ERROR ($msg)" -ForegroundColor Red
    $failed = $true
}

Write-Host ""
Write-Host "=== Health Check Complete ===" -ForegroundColor Cyan
if ($failed) {
    Write-Host "System Status: ISSUES DETECTED" -ForegroundColor Red
    exit 1
}

Write-Host "System Status: ALL SYSTEMS OPERATIONAL" -ForegroundColor Green
exit 0