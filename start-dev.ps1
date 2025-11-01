# ROMS Development Server Startup Script
# This script starts both backend and frontend servers in parallel

Write-Host "🚀 Starting ROMS Development Environment..." -ForegroundColor Green
Write-Host ""

# Function to test if port is in use
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Check if ports are already in use
Write-Host "🔍 Checking if ports are available..." -ForegroundColor Yellow

if (Test-Port 4000) {
    Write-Host "⚠️  Port 4000 is already in use. Backend may already be running." -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 4000 is available for backend" -ForegroundColor Green
}

if (Test-Port 3000) {
    Write-Host "⚠️  Port 3000 is already in use. Frontend may already be running." -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 3000 is available for frontend" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Starting Backend Server (Port 4000)..." -ForegroundColor Cyan
Write-Host "📦 Starting Frontend Server (Port 3000)..." -ForegroundColor Cyan
Write-Host ""

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Magenta; npm start"

# Wait a moment before starting frontend
Start-Sleep -Seconds 2

# Start frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host '⚡ Frontend Server Starting...' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "✅ Development servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Backend API:  http://localhost:4000" -ForegroundColor White
Write-Host "📍 Frontend UI:  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Test Credentials:" -ForegroundColor Yellow
Write-Host "   Admin:  admin@roms.com / admin123" -ForegroundColor Gray
Write-Host "   Customer: john@example.com / admin123" -ForegroundColor Gray
Write-Host ""
Write-Host "⏳ Servers will open in separate windows..." -ForegroundColor Yellow
Write-Host "   Wait 10-15 seconds for both servers to fully start" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

