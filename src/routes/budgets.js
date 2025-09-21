const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validate, budgetSchema } = require('../utils/validation');

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Obtener presupuestos del usuario
router.get('/', async (req, res) => {
    try {
        const { month, year } = req.query;
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        const whereClause = {
            userId: req.user.id,
            month: targetMonth,
            year: targetYear
        };

        const budgets = await prisma.monthlyBudget.findMany({
            where: whereClause,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                        type: true
                    }
                }
            },
            orderBy: { category: { name: 'asc' } }
        });

        // Calcular estadísticas de gastos reales para cada categoría
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0);

        const actualExpenses = await prisma.transaction.groupBy({
            by: ['categoryId'],
            where: {
                userId: req.user.id,
                type: 'EXPENSE',
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _sum: {
                amount: true
            }
        });

        // Crear mapa de gastos reales por categoría
        const expensesMap = {};
        actualExpenses.forEach(expense => {
            expensesMap[expense.categoryId] = Number(expense._sum.amount);
        });

        // Combinar presupuestos con gastos reales
        const budgetsWithActuals = budgets.map(budget => {
            const actualSpent = expensesMap[budget.categoryId] || 0;
            const remaining = budget.budgetAmount - actualSpent;
            const percentageUsed = budget.budgetAmount > 0
                ? (actualSpent / budget.budgetAmount) * 100
                : 0;

            return {
                ...budget,
                actualSpent,
                remaining,
                percentageUsed: Math.min(percentageUsed, 100),
                isOverBudget: actualSpent > budget.budgetAmount
            };
        });

        // Calcular totales
        const totalBudget = budgets.reduce((sum, budget) => sum + Number(budget.budgetAmount), 0);
        const totalSpent = Object.values(expensesMap).reduce((sum, amount) => sum + amount, 0);
        const totalRemaining = totalBudget - totalSpent;

        res.json({
            success: true,
            data: {
                budgets: budgetsWithActuals,
                summary: {
                    totalBudget: Number(totalBudget),
                    totalSpent: Number(totalSpent),
                    totalRemaining: Number(totalRemaining),
                    percentageUsed: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
                    month: targetMonth,
                    year: targetYear
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener presupuestos:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Crear o actualizar presupuesto
router.post('/', validate(budgetSchema), async (req, res) => {
    try {
        const { categoryId, budgetAmount, month, year } = req.body;

        // Verificar que la categoría pertenece al usuario
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                userId: req.user.id,
                type: 'EXPENSE' // Solo categorías de gastos pueden tener presupuesto
            }
        });

        if (!category) {
            return res.status(400).json({
                success: false,
                error: 'Categoría no encontrada o no es de tipo gasto'
            });
        }

        // Crear o actualizar presupuesto
        const budget = await prisma.monthlyBudget.upsert({
            where: {
                userId_categoryId_month_year: {
                    userId: req.user.id,
                    categoryId,
                    month,
                    year
                }
            },
            update: {
                budgetAmount
            },
            create: {
                userId: req.user.id,
                categoryId,
                budgetAmount,
                month,
                year
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true,
                        type: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Presupuesto creado/actualizado exitosamente',
            data: { budget }
        });
    } catch (error) {
        console.error('Error al crear/actualizar presupuesto:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Eliminar presupuesto
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const budgetId = parseInt(id);

        if (isNaN(budgetId)) {
            return res.status(400).json({
                success: false,
                error: 'ID de presupuesto inválido'
            });
        }

        // Verificar que el presupuesto existe y pertenece al usuario
        const existingBudget = await prisma.monthlyBudget.findFirst({
            where: {
                id: budgetId,
                userId: req.user.id
            }
        });

        if (!existingBudget) {
            return res.status(404).json({
                success: false,
                error: 'Presupuesto no encontrado'
            });
        }

        await prisma.monthlyBudget.delete({
            where: { id: budgetId }
        });

        res.json({
            success: true,
            message: 'Presupuesto eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar presupuesto:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Obtener resumen de presupuestos por mes
router.get('/summary', async (req, res) => {
    try {
        const { month, year } = req.query;
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        // Obtener todos los presupuestos del mes
        const budgets = await prisma.monthlyBudget.findMany({
            where: {
                userId: req.user.id,
                month: targetMonth,
                year: targetYear
            }
        });

        // Obtener gastos reales del mes
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0);

        const expenses = await prisma.transaction.findMany({
            where: {
                userId: req.user.id,
                type: 'EXPENSE',
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        color: true
                    }
                }
            }
        });

        // Agrupar gastos por categoría
        const expensesByCategory = {};
        expenses.forEach(expense => {
            const categoryId = expense.categoryId || 'uncategorized';
            if (!expensesByCategory[categoryId]) {
                expensesByCategory[categoryId] = {
                    category: expense.category || { name: 'Sin categoría', color: '#6B7280' },
                    amount: 0
                };
            }
            expensesByCategory[categoryId].amount += Number(expense.amount);
        });

        // Combinar presupuestos con gastos reales
        const budgetSummary = budgets.map(budget => {
            const actualSpent = expensesByCategory[budget.categoryId]?.amount || 0;
            return {
                categoryId: budget.categoryId,
                budgetAmount: Number(budget.budgetAmount),
                actualSpent,
                remaining: Number(budget.budgetAmount) - actualSpent,
                percentageUsed: Number(budget.budgetAmount) > 0
                    ? (actualSpent / Number(budget.budgetAmount)) * 100
                    : 0
            };
        });

        // Calcular totales
        const totalBudget = budgets.reduce((sum, budget) => sum + Number(budget.budgetAmount), 0);
        const totalSpent = Object.values(expensesByCategory).reduce((sum, cat) => sum + cat.amount, 0);

        res.json({
            success: true,
            data: {
                month: targetMonth,
                year: targetYear,
                totalBudget: Number(totalBudget),
                totalSpent: Number(totalSpent),
                totalRemaining: Number(totalBudget - totalSpent),
                percentageUsed: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
                categories: budgetSummary
            }
        });
    } catch (error) {
        console.error('Error al obtener resumen de presupuestos:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

module.exports = router;
