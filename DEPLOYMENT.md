# 🚀 Guía de Deployment - MiBalance

## Opciones de Deployment

### Opción 1: Deploy Completo (Recomendado)

- **Backend**: Railway (gratis)
- **Frontend**: Vercel (gratis)
- **Base de datos**: Supabase (gratis)

### Opción 2: Deploy Simple

- **Todo en Vercel** con base de datos local

---

## 🎯 Opción 1: Deploy Completo

### 1. Preparar Base de Datos (Supabase)

1. Ve a [supabase.com](https://supabase.com)
2. Crea cuenta gratuita
3. Crea nuevo proyecto
4. Ve a Settings → Database
5. Copia la "Connection string" (URI)
6. Reemplaza la contraseña en la URI

### 2. Deploy Backend (Railway)

1. Ve a [railway.app](https://railway.app)
2. Conecta tu GitHub
3. Crea nuevo proyecto desde GitHub
4. Selecciona tu repositorio MiBalance
5. Configura variables de entorno:
   ```
   DATABASE_URL=tu_supabase_uri_aqui
   JWT_SECRET=tu_jwt_secret_muy_seguro
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://tu-frontend.vercel.app
   ```

### 3. Deploy Frontend (Vercel)

1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu GitHub
3. Importa tu proyecto
4. Configura variables de entorno:
   ```
   VITE_API_URL=https://tu-backend.railway.app/api
   ```
5. Deploy

### 4. Actualizar Base de Datos

1. Conecta a tu base de datos Supabase
2. Ejecuta las migraciones:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

---

## 🎯 Opción 2: Deploy Simple (Vercel)

### 1. Preparar para Vercel

1. Actualiza el backend para usar SQLite local
2. Configura build command en Vercel
3. Deploy todo junto

---

## 📱 URLs Finales

- **Frontend**: https://tu-proyecto.vercel.app
- **Backend**: https://tu-proyecto.railway.app
- **LinkedIn**: Comparte el link del frontend

---

## 🔧 Comandos Útiles

```bash
# Verificar que todo funciona localmente
npm run dev

# Build para producción
npm run build

# Verificar base de datos
npx prisma studio
```
