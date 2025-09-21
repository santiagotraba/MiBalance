const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validate } = require('../utils/validation');
const Joi = require('joi');

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Obtener perfil del usuario
router.get('/profile', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Actualizar perfil del usuario
const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional()
});

router.put('/profile', validate(updateProfileSchema), async (req, res) => {
    try {
        const { name, email } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (email) {
            // Verificar si el email ya existe
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser && existingUser.id !== req.user.id) {
                return res.status(400).json({
                    success: false,
                    error: 'El email ya está en uso'
                });
            }
            updateData.email = email;
        }

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            data: { user }
        });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Obtener estadísticas del usuario
router.get('/stats', async (req, res) => {
    try {
        const userId = req.user.id;

        // Obtener estadísticas básicas
        const [
            totalTransactions,
            totalCategories,
            totalSavingsGoals,
            currentMonthTransactions
        ] = await Promise.all([
            prisma.transaction.count({
                where: { userId }
            }),
            prisma.category.count({
                where: { userId }
            }),
            prisma.savingsGoal.count({
                where: { userId }
            }),
            prisma.transaction.count({
                where: {
                    userId,
                    date: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                    }
                }
            })
        ]);

        // Obtener balance del mes actual
        const currentMonth = new Date();
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        const monthlyStats = await prisma.transaction.aggregate({
            where: {
                userId,
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            },
            _sum: {
                amount: true
            }
        });

        const incomeStats = await prisma.transaction.aggregate({
            where: {
                userId,
                type: 'INCOME',
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            },
            _sum: {
                amount: true
            }
        });

        const expenseStats = await prisma.transaction.aggregate({
            where: {
                userId,
                type: 'EXPENSE',
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            },
            _sum: {
                amount: true
            }
        });

        const totalIncome = incomeStats._sum.amount || 0;
        const totalExpenses = expenseStats._sum.amount || 0;
        const balance = totalIncome - totalExpenses;

        res.json({
            success: true,
            data: {
                totalTransactions,
                totalCategories,
                totalSavingsGoals,
                currentMonthTransactions,
                monthlyStats: {
                    totalIncome: Number(totalIncome),
                    totalExpenses: Number(totalExpenses),
                    balance: Number(balance)
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

module.exports = router;
