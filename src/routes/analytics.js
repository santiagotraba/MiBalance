const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Obtener balance general
router.get('/balance', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.user.id;

        // Si no se proporcionan fechas, usar el mes actual
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        } else {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            dateFilter = {
                gte: startOfMonth,
                lte: endOfMonth
            };
        }

        // Obtener totales de ingresos y gastos
        const [incomeStats, expenseStats] = await Promise.all([
            prisma.transaction.aggregate({
                where: {
                    userId,
                    type: 'INCOME',
                    date: dateFilter
                },
                _sum: { amount: true },
                _count: { id: true }
            }),
            prisma.transaction.aggregate({
                where: {
                    userId,
                    type: 'EXPENSE',
                    date: dateFilter
                },
                _sum: { amount: true },
                _count: { id: true }
            })
        ]);

        const totalIncome = Number(incomeStats._sum.amount || 0);
        const totalExpenses = Number(expenseStats._sum.amount || 0);
        const balance = totalIncome - totalExpenses;

        res.json({
            success: true,
            data: {
                totalIncome,
                totalExpenses,
                balance,
                transactionCount: {
                    income: incomeStats._count.id,
                    expense: expenseStats._count.id
                },
                period: {
                    startDate: dateFilter.gte,
                    endDate: dateFilter.lte
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener balance:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Obtener desglose por categorías
router.get('/categories', async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;
        const userId = req.user.id;

        // Si no se proporcionan fechas, usar el mes actual
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        } else {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            dateFilter = {
                gte: startOfMonth,
                lte: endOfMonth
            };
        }

        const whereClause = {
            userId,
            date: dateFilter
        };

        if (type && ['INCOME', 'EXPENSE'].includes(type)) {
            whereClause.type = type;
        }

        // Obtener transacciones agrupadas por categoría
        const categoryStats = await prisma.transaction.groupBy({
            by: ['categoryId', 'type'],
            where: whereClause,
            _sum: { amount: true },
            _count: { id: true }
        });

        // Obtener información de las categorías
        const categoryIds = [...new Set(categoryStats.map(stat => stat.categoryId).filter(Boolean))];
        const categories = await prisma.category.findMany({
            where: {
                id: { in: categoryIds },
                userId
            },
            select: {
                id: true,
                name: true,
                color: true,
                icon: true,
                type: true
            }
        });

        // Crear mapa de categorías
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.id] = cat;
        });

        // Combinar estadísticas con información de categorías
        const categoryBreakdown = categoryStats.map(stat => {
            const category = categoryMap[stat.categoryId] || {
                id: stat.categoryId,
                name: 'Sin categoría',
                color: '#6B7280',
                icon: null,
                type: stat.type
            };

            return {
                categoryId: stat.categoryId,
                categoryName: category.name,
                categoryColor: category.color,
                categoryIcon: category.icon,
                type: stat.type,
                amount: Number(stat._sum.amount || 0),
                transactionCount: stat._count.id
            };
        });

        // Calcular totales
        const totalAmount = categoryBreakdown.reduce((sum, item) => sum + item.amount, 0);

        // Agregar porcentajes
        const categoryBreakdownWithPercentages = categoryBreakdown.map(item => ({
            ...item,
            percentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0
        }));

        // Ordenar por monto descendente
        categoryBreakdownWithPercentages.sort((a, b) => b.amount - a.amount);

        res.json({
            success: true,
            data: {
                categories: categoryBreakdownWithPercentages,
                totalAmount: Number(totalAmount),
                period: {
                    startDate: dateFilter.gte,
                    endDate: dateFilter.lte
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener desglose por categorías:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Obtener tendencias mensuales
router.get('/monthly-trends', async (req, res) => {
    try {
        const { year, type } = req.query;
        const userId = req.user.id;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        const whereClause = {
            userId,
            date: {
                gte: new Date(targetYear, 0, 1),
                lt: new Date(targetYear + 1, 0, 1)
            }
        };

        if (type && ['INCOME', 'EXPENSE'].includes(type)) {
            whereClause.type = type;
        }

        // Obtener transacciones agrupadas por mes
        const monthlyStats = await prisma.transaction.groupBy({
            by: ['type'],
            where: whereClause,
            _sum: { amount: true },
            _count: { id: true }
        });

        // Crear datos para cada mes
        const monthlyData = [];
        for (let month = 0; month < 12; month++) {
            const monthStart = new Date(targetYear, month, 1);
            const monthEnd = new Date(targetYear, month + 1, 0);

            const monthStats = await prisma.transaction.groupBy({
                by: ['type'],
                where: {
                    userId,
                    type: whereClause.type,
                    date: {
                        gte: monthStart,
                        lte: monthEnd
                    }
                },
                _sum: { amount: true },
                _count: { id: true }
            });

            const incomeData = monthStats.find(stat => stat.type === 'INCOME');
            const expenseData = monthStats.find(stat => stat.type === 'EXPENSE');

            monthlyData.push({
                month: month + 1,
                monthName: monthStart.toLocaleString('es-ES', { month: 'long' }),
                income: Number(incomeData?._sum.amount || 0),
                expense: Number(expenseData?._sum.amount || 0),
                balance: Number(incomeData?._sum.amount || 0) - Number(expenseData?._sum.amount || 0),
                transactionCount: {
                    income: incomeData?._count.id || 0,
                    expense: expenseData?._count.id || 0
                }
            });
        }

        // Calcular totales del año
        const yearlyTotals = monthlyData.reduce(
            (totals, month) => ({
                totalIncome: totals.totalIncome + month.income,
                totalExpense: totals.totalExpense + month.expense,
                totalBalance: totals.totalBalance + month.balance
            }),
            { totalIncome: 0, totalExpense: 0, totalBalance: 0 }
        );

        res.json({
            success: true,
            data: {
                monthlyData,
                yearlyTotals,
                year: targetYear
            }
        });
    } catch (error) {
        console.error('Error al obtener tendencias mensuales:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Obtener transacciones recientes
router.get('/recent-transactions', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const userId = req.user.id;

        const transactions = await prisma.transaction.findMany({
            where: { userId },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit)
        });

        res.json({
            success: true,
            data: { transactions }
        });
    } catch (error) {
        console.error('Error al obtener transacciones recientes:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Obtener estadísticas de metas de ahorro
router.get('/savings-stats', async (req, res) => {
    try {
        const userId = req.user.id;

        const goals = await prisma.savingsGoal.findMany({
            where: { userId }
        });

        const totalGoals = goals.length;
        const achievedGoals = goals.filter(goal => goal.isAchieved).length;
        const totalTargetAmount = goals.reduce((sum, goal) => sum + Number(goal.targetAmount), 0);
        const totalCurrentAmount = goals.reduce((sum, goal) => sum + Number(goal.currentAmount), 0);
        const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

        // Metas próximas a vencer (en los próximos 30 días)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const upcomingGoals = goals.filter(goal =>
            goal.targetDate &&
            new Date(goal.targetDate) <= thirtyDaysFromNow &&
            !goal.isAchieved
        );

        res.json({
            success: true,
            data: {
                totalGoals,
                achievedGoals,
                activeGoals: totalGoals - achievedGoals,
                totalTargetAmount: Number(totalTargetAmount),
                totalCurrentAmount: Number(totalCurrentAmount),
                overallProgress: Math.min(overallProgress, 100),
                upcomingGoals: upcomingGoals.length
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de ahorro:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

module.exports = router;
