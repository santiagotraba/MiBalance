# 💰 MiBalance - Aplicación de Finanzas Personales

Una aplicación fullstack moderna para gestionar tus finanzas personales, con un backend robusto en Node.js/Express y un frontend elegante en React.

## 🚀 Características

### ✨ Funcionalidades Principales

- **Gestión de Transacciones**: Registra ingresos y gastos con categorías personalizables
- **Dashboard Intuitivo**: Resumen visual de tu situación financiera
- **Categorías Personalizables**: Organiza tus transacciones por categorías
- **Metas de Ahorro**: Establece y sigue el progreso de tus objetivos financieros
- **Presupuestos Mensuales**: Controla tus gastos con límites por categoría
- **Reportes y Gráficos**: Visualiza tendencias y patrones de gasto
- **Autenticación Segura**: Sistema de login/registro con JWT

### 🎨 Interfaz de Usuario

- Diseño moderno y responsivo con Tailwind CSS
- Gráficos interactivos con Chart.js
- Formularios intuitivos con validación en tiempo real
- Notificaciones toast para feedback del usuario
- Navegación fluida entre secciones

## 🛠️ Stack Tecnológico

### Backend

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional
- **Prisma** - ORM moderno
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **Joi** - Validación de datos

### Frontend

- **React 18** - Biblioteca de UI
- **Vite** - Herramienta de construcción
- **React Router** - Enrutamiento
- **Tailwind CSS** - Framework de estilos
- **Chart.js** - Gráficos
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL 12+
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd MiBalance
```

### 2. Configurar el Backend

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env
# Editar .env con tus configuraciones

# Configurar la base de datos
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Iniciar el servidor de desarrollo
npm run dev
```

### 3. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

### 4. Acceder a la aplicación

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Base de datos: Configurar en .env

## 🔧 Configuración de Variables de Entorno

### Backend (.env)

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/mibalance"

# JWT
JWT_SECRET="tu_jwt_secret_muy_seguro_aqui"
JWT_EXPIRES_IN="7d"

# Servidor
PORT=5000
NODE_ENV="development"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **users** - Información de usuarios
- **categories** - Categorías de transacciones
- **transactions** - Registro de ingresos y gastos
- **savings_goals** - Metas de ahorro
- **monthly_budgets** - Presupuestos mensuales

### Relaciones

- Un usuario tiene muchas categorías, transacciones, metas y presupuestos
- Una categoría puede tener muchas transacciones
- Las transacciones pueden estar asociadas a una categoría

## 🚀 Scripts Disponibles

### Backend

```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo
npm test           # Ejecutar tests
npm run db:generate # Generar cliente Prisma
npm run db:migrate  # Ejecutar migraciones
npm run db:seed     # Poblar base de datos
npm run db:studio   # Abrir Prisma Studio
```

### Frontend

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Construir para producción
npm run preview    # Vista previa de producción
npm run lint       # Linter
```

## 📱 Uso de la Aplicación

### 1. Registro e Inicio de Sesión

- Crea una cuenta nueva o usa las credenciales de demo
- **Demo**: demo@mibalance.com / password123

### 2. Dashboard

- Visualiza tu balance actual
- Revisa transacciones recientes
- Monitorea el progreso de tus metas

### 3. Gestión de Transacciones

- Agrega ingresos y gastos
- Asigna categorías
- Filtra y busca transacciones

### 4. Categorías

- Personaliza categorías de ingresos y gastos
- Asigna colores e iconos
- Organiza tus finanzas

### 5. Metas de Ahorro

- Establece objetivos financieros
- Haz seguimiento del progreso
- Recibe notificaciones de vencimiento

### 6. Presupuestos

- Configura límites mensuales por categoría
- Monitorea gastos vs presupuesto
- Recibe alertas de sobrepaso

### 7. Reportes

- Visualiza gráficos de gastos por categoría
- Analiza tendencias mensuales
- Exporta datos para análisis

## 🔒 Seguridad

- Autenticación JWT con tokens seguros
- Contraseñas encriptadas con bcrypt
- Validación de datos en frontend y backend
- CORS configurado correctamente
- Headers de seguridad con Helmet

## 🧪 Testing

```bash
# Backend
npm test

# Frontend
cd frontend
npm test
```

## 📈 Despliegue

### Backend (Railway/Heroku)

1. Conectar repositorio
2. Configurar variables de entorno
3. Desplegar automáticamente

### Frontend (Vercel/Netlify)

1. Conectar repositorio
2. Configurar build command: `npm run build`
3. Configurar variables de entorno
4. Desplegar

### Base de Datos (Supabase/PlanetScale)

1. Crear instancia de PostgreSQL
2. Obtener URL de conexión
3. Configurar en variables de entorno

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para ayudar a las personas a gestionar mejor sus finanzas personales.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

¡Gracias por usar MiBalance! 🎉
