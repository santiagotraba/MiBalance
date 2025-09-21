# Script para iniciar el backend de MiBalance
Write-Host "🚀 Iniciando backend de MiBalance..." -ForegroundColor Green

# Cambiar al directorio del proyecto
Set-Location "C:\Users\Toni\Desktop\MiBalance"

# Verificar si el archivo .env existe
if (-not (Test-Path ".env")) {
    Write-Host "❌ Archivo .env no encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Archivo .env encontrado" -ForegroundColor Green

# Verificar si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Iniciar el servidor
Write-Host "🔧 Iniciando servidor backend..." -ForegroundColor Yellow
Write-Host "🌐 El servidor estará disponible en: http://localhost:5003" -ForegroundColor Cyan
Write-Host "⏹️  Para detener el servidor, presiona Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Ejecutar el servidor
npm run dev
