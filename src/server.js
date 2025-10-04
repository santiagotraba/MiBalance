const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const transactionRoutes = require('./routes/transactions');
const savingsGoalRoutes = require('./routes/savingsGoals');
const budgetRoutes = require('./routes/budgets');
const analyticsRoutes = require('./routes/analytics');

const errorHandler = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware de seguridad
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Middleware de logging
app.use(morgan('combined'));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/savings-goals', savingsGoalRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Ruta temporal para ejecutar seed
app.post('/api/seed', async (req, res) => {
    try {
        const { exec } = require('child_process');
        exec('npm run db:seed', (error, stdout, stderr) => {
            if (error) {
                console.error('Error ejecutando seed:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Error ejecutando seed',
                    details: error.message
                });
            }
            res.json({
                success: true,
                message: 'Seed ejecutado exitosamente',
                output: stdout
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error interno',
            details: error.message
        });
    }
});

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📊 Entorno: ${process.env.NODE_ENV}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
