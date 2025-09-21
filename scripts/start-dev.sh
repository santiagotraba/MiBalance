#!/bin/bash

# Script para iniciar el entorno de desarrollo
echo "🚀 Iniciando MiBalance en modo desarrollo..."

# Verificar si el archivo .env existe
if [ ! -f .env ]; then
    echo "❌ Archivo .env no encontrado. Ejecuta ./scripts/setup.sh primero."
    exit 1
fi

# Verificar si la base de datos está configurada
if ! npx prisma db push --accept-data-loss &> /dev/null; then
    echo "❌ Error conectando a la base de datos. Verifica tu DATABASE_URL en .env"
    exit 1
fi

echo "✅ Base de datos conectada"

# Iniciar backend en background
echo "🔧 Iniciando backend..."
npm run dev &
BACKEND_PID=$!

# Esperar un momento para que el backend inicie
sleep 3

# Iniciar frontend
echo "🎨 Iniciando frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 ¡MiBalance iniciado exitosamente!"
echo ""
echo "🌐 Aplicación disponible en:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5003"
echo ""
echo "🔑 Credenciales de demo:"
echo "   Email: demo@mibalance.com"
echo "   Password: password123"
echo ""
echo "⏹️  Para detener la aplicación, presiona Ctrl+C"

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo aplicación..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Esperar a que termine cualquiera de los procesos
wait
