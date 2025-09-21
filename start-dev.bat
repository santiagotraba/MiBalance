@echo off
echo 🚀 Iniciando MiBalance en modo desarrollo...

REM Verificar si el archivo .env existe
if not exist ".env" (
    echo ❌ Archivo .env no encontrado. Ejecuta ./scripts/setup.sh primero.
    pause
    exit /b 1
)

echo ✅ Archivo .env encontrado

REM Iniciar backend
echo 🔧 Iniciando backend...
start "Backend" cmd /k "npm run dev"

REM Esperar un momento para que el backend inicie
timeout /t 5 /nobreak >nul

REM Iniciar frontend
echo 🎨 Iniciando frontend...
cd frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo 🎉 ¡MiBalance iniciado exitosamente!
echo.
echo 🌐 Aplicación disponible en:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5003
echo.
echo 🔑 Credenciales de demo:
echo    Email: demo@mibalance.com
echo    Password: password123
echo.
echo ⏹️  Para detener la aplicación, cierra las ventanas de terminal
pause
