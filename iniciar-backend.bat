@echo off
echo 🚀 Iniciando backend de MiBalance...

REM Verificar si el archivo .env existe
if not exist ".env" (
    echo ❌ Archivo .env no encontrado
    pause
    exit /b 1
)

echo ✅ Archivo .env encontrado

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
)

REM Iniciar el servidor
echo 🔧 Iniciando servidor backend...
echo 🌐 El servidor estará disponible en: http://localhost:5003
echo ⏹️  Para detener el servidor, presiona Ctrl+C
echo.

REM Ejecutar el servidor
npm run dev

pause
