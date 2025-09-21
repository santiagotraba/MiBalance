# Script para iniciar MiBalance en Windows
Write-Host "🚀 Iniciando MiBalance en modo desarrollo..." -ForegroundColor Green

# Verificar si el archivo .env existe
if (-not (Test-Path ".env")) {
    Write-Host "❌ Archivo .env no encontrado. Ejecuta ./scripts/setup.sh primero." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Archivo .env encontrado" -ForegroundColor Green

# Iniciar backend
Write-Host "🔧 Iniciando backend..." -ForegroundColor Yellow
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Minimized

# Esperar un momento para que el backend inicie
Start-Sleep -Seconds 5

# Iniciar frontend
Write-Host "🎨 Iniciando frontend..." -ForegroundColor Yellow
Set-Location frontend
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Normal

Write-Host ""
Write-Host "🎉 ¡MiBalance iniciado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Aplicación disponible en:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5003" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Credenciales de demo:" -ForegroundColor Cyan
Write-Host "   Email: demo@mibalance.com" -ForegroundColor White
Write-Host "   Password: password123" -ForegroundColor White
Write-Host ""
Write-Host "⏹️  Para detener la aplicación, cierra las ventanas de terminal" -ForegroundColor Yellow
