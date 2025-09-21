#!/bin/bash

echo "🚀 Iniciando deployment de MiBalance..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

echo "✅ Proyecto encontrado"

# Verificar que el backend esté funcionando
echo "🔍 Verificando backend..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend funcionando correctamente"
else
    echo "⚠️  Backend no está ejecutándose. Iniciando..."
    npm run dev &
    sleep 5
fi

# Verificar que el frontend esté funcionando
echo "🔍 Verificando frontend..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend funcionando correctamente"
else
    echo "⚠️  Frontend no está ejecutándose. Iniciando..."
    cd frontend && npm run dev &
    sleep 5
    cd ..
fi

echo ""
echo "🎉 ¡Proyecto listo para deployment!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Sube tu código a GitHub"
echo "2. Configura Railway para el backend"
echo "3. Configura Vercel para el frontend"
echo "4. Configura Supabase para la base de datos"
echo ""
echo "📖 Lee DEPLOYMENT.md para instrucciones detalladas"
echo ""
echo "🔗 URLs para compartir en LinkedIn:"
echo "- Frontend: https://tu-proyecto.vercel.app"
echo "- GitHub: https://github.com/tu-usuario/MiBalance"
