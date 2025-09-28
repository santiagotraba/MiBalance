# 🔧 Configuración de Variables de Entorno para Deployment

## Para Render (Backend) - 100% GRATUITO

Configura estas variables en Render → Environment:

```bash
DATABASE_URL=postgresql://postgres:[TU-PASSWORD]@db.xxx.supabase.co:5432/postgres
JWT_SECRET=447d6f9e16014f880f431968f44452ff030ac33fa15a5f59b1a3d8db03242bfc5ca4f659fa00372f545640ab2968042b8e7b80ea897b4462241a4f78e22c741b
JWT_EXPIRES_IN=7d
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.vercel.app
```

**O usa la base de datos de Render** (recomendado):

- Render creará automáticamente una base de datos PostgreSQL gratuita
- La DATABASE_URL se configurará automáticamente

## Para Vercel (Frontend)

Configura estas variables en Vercel → Settings → Environment Variables:

```bash
VITE_API_URL=https://mibalance-backend.onrender.com/api
```

## Generar JWT_SECRET seguro

Puedes generar un JWT secret seguro ejecutando:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## URLs que obtendrás

- **Frontend**: https://tu-proyecto.vercel.app
- **Backend**: https://mibalance-backend.onrender.com
- **API**: https://mibalance-backend.onrender.com/api

## Pasos de deployment

1. ✅ Configurar Supabase (base de datos) - OPCIONAL
2. 🚀 Deploy Backend en Render (100% GRATUITO)
3. 🚀 Deploy Frontend en Vercel
4. 🔧 Configurar variables de entorno
5. 📊 Ejecutar migraciones
6. ✅ Probar todo
