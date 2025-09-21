#!/bin/bash

# Script de configuración para MiBalance
echo "🚀 Configurando MiBalance..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ primero."
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Se requiere Node.js 18 o superior. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Verificar si PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL no está instalado. Por favor instala PostgreSQL 12+ primero."
    echo "   Puedes usar Docker: docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15"
    exit 1
fi

echo "✅ PostgreSQL detectado"

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
npm install

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install
cd ..

# Configurar archivo .env si no existe
if [ ! -f .env ]; then
    echo "⚙️  Creando archivo .env..."
    cp env.example .env
    echo "📝 Por favor edita el archivo .env con tus configuraciones de base de datos"
fi

# Generar cliente Prisma
echo "🔧 Generando cliente Prisma..."
npx prisma generate

echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura tu base de datos PostgreSQL"
echo "2. Edita el archivo .env con tu DATABASE_URL"
echo "3. Ejecuta: npm run db:migrate"
echo "4. Ejecuta: npm run db:seed"
echo "5. Inicia el backend: npm run dev"
echo "6. En otra terminal, inicia el frontend: cd frontend && npm run dev"
echo ""
echo "🌐 La aplicación estará disponible en:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "🔑 Credenciales de demo:"
echo "   Email: demo@mibalance.com"
echo "   Password: password123"
