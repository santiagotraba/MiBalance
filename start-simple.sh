#!/bin/bash

echo "🚀 Iniciando MiBalance..."

# Verificar si el archivo .env existe
if [ ! -f .env ]; then
    echo "❌ Archivo .env no encontrado"
    exit 1
fi

echo "✅ Archivo .env encontrado"

# Iniciar backend
echo "🔧 Iniciando backend..."
npm run dev &
BACKEND_PID=$!

# Esperar un momento
sleep 5

# Verificar si el backend está ejecutándose
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend iniciado correctamente"
else
    echo "❌ Error al iniciar backend"
    exit 1
fi

echo ""
echo "🎉 ¡Backend iniciado exitosamente!"
echo "🌐 Backend disponible en: http://localhost:5003"
echo ""
echo "🔑 Credenciales de demo:"
echo "   Email: demo@mibalance.com"
echo "   Password: password123"
echo ""
echo "⏹️  Para detener el backend, presiona Ctrl+C"

# Esperar a que termine el proceso
wait $BACKEND_PID
