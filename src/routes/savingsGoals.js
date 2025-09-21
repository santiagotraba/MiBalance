const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validate, savingsGoalSchema } = require('../utils/validation');

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Obtener todas las metas de ahorro del usuario
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const whereClause = { userId: req.user.id };

        if (status === 'achieved') {
            whereClause.isAchieved = true;
        } else if (status === 'active') {
            whereClause.isAchieved = false;
        }

        const goals = await prisma.savingsGoal.findMany({
            where: whereClause,
            orderBy: [
                { isAchieved: 'asc' },
                { targetDate: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        // Calcular progreso y días restantes
        const goalsWithProgress = goals.map(goal => {
            const progress = goal.targetAmount > 0
                ? (goal.currentAmount / goal.targetAmount) * 100
                : 0;

            const daysRemaining = goal.targetDate
                ? Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24))
                : null;

            return {
                ...goal,
                progress: Math.min(progress, 100),
                daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
                isOverdue: daysRemaining < 0 && !goal.isAchieved
            };
        });

        res.json({
            success: true,
            data: { goals: goalsWithProgress }
        });
    } catch (error) {
        console.error('Error al obtener metas de ahorro:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Obtener una meta de ahorro específica
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const goalId = parseInt(id);

        if (isNaN(goalId)) {
            return res.status(400).json({
                success: false,
                error: 'ID de meta inválido'
            });
        }

        const goal = await prisma.savingsGoal.findFirst({
            where: {
                id: goalId,
                userId: req.user.id
            }
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                error: 'Meta de ahorro no encontrada'
            });
        }

        const progress = goal.targetAmount > 0
            ? (goal.currentAmount / goal.targetAmount) * 100
            : 0;

        const daysRemaining = goal.targetDate
            ? Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24))
            : null;

        res.json({
            success: true,
            data: {
                goal: {
                    ...goal,
                    progress: Math.min(progress, 100),
                    daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
                    isOverdue: daysRemaining < 0 && !goal.isAchieved
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener meta de ahorro:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Crear nueva meta de ahorro
router.post('/', validate(savingsGoalSchema), async (req, res) => {
    try {
        const { name, targetAmount, targetDate } = req.body;

        const goal = await prisma.savingsGoal.create({
            data: {
                userId: req.user.id,
                name,
                targetAmount,
                targetDate: targetDate ? new Date(targetDate) : null
            }
        });

        res.status(201).json({
            success: true,
            message: 'Meta de ahorro creada exitosamente',
            data: { goal }
        });
    } catch (error) {
        console.error('Error al crear meta de ahorro:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Actualizar meta de ahorro
const updateGoalSchema = require('../utils/validation').savingsGoalSchema.fork(['name', 'targetAmount', 'targetDate'], (schema) => schema.optional());

router.put('/:id', validate(updateGoalSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const goalId = parseInt(id);
        const { name, targetAmount, targetDate, currentAmount } = req.body;

        if (isNaN(goalId)) {
            return res.status(400).json({
                success: false,
                error: 'ID de meta inválido'
            });
        }

        // Verificar que la meta existe y pertenece al usuario
        const existingGoal = await prisma.savingsGoal.findFirst({
            where: {
                id: goalId,
                userId: req.user.id
            }
        });

        if (!existingGoal) {
            return res.status(404).json({
                success: false,
                error: 'Meta de ahorro no encontrada'
            });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (targetAmount !== undefined) updateData.targetAmount = targetAmount;
        if (targetDate !== undefined) updateData.targetDate = targetDate ? new Date(targetDate) : null;
        if (currentAmount !== undefined) {
            updateData.currentAmount = currentAmount;
            // Verificar si se alcanzó la meta
            if (currentAmount >= targetAmount) {
                updateData.isAchieved = true;
            }
        }

        const goal = await prisma.savingsGoal.update({
            where: { id: goalId },
            data: updateData
        });

        res.json({
            success: true,
            message: 'Meta de ahorro actualizada exitosamente',
            data: { goal }
        });
    } catch (error) {
        console.error('Error al actualizar meta de ahorro:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Agregar dinero a una meta de ahorro
router.post('/:id/add-money', async (req, res) => {
    try {
        const { id } = req.params;
        const goalId = parseInt(id);
        const { amount } = req.body;

        if (isNaN(goalId)) {
            return res.status(400).json({
                success: false,
                error: 'ID de meta inválido'
            });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'El monto debe ser mayor a 0'
            });
        }

        // Verificar que la meta existe y pertenece al usuario
        const existingGoal = await prisma.savingsGoal.findFirst({
            where: {
                id: goalId,
                userId: req.user.id
            }
        });

        if (!existingGoal) {
            return res.status(404).json({
                success: false,
                error: 'Meta de ahorro no encontrada'
            });
        }

        const newCurrentAmount = existingGoal.currentAmount + amount;
        const isAchieved = newCurrentAmount >= existingGoal.targetAmount;

        const goal = await prisma.savingsGoal.update({
            where: { id: goalId },
            data: {
                currentAmount: newCurrentAmount,
                isAchieved
            }
        });

        res.json({
            success: true,
            message: `Se agregaron $${amount} a la meta de ahorro`,
            data: { goal }
        });
    } catch (error) {
        console.error('Error al agregar dinero a la meta:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Eliminar meta de ahorro
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const goalId = parseInt(id);

        if (isNaN(goalId)) {
            return res.status(400).json({
                success: false,
                error: 'ID de meta inválido'
            });
        }

        // Verificar que la meta existe y pertenece al usuario
        const existingGoal = await prisma.savingsGoal.findFirst({
            where: {
                id: goalId,
                userId: req.user.id
            }
        });

        if (!existingGoal) {
            return res.status(404).json({
                success: false,
                error: 'Meta de ahorro no encontrada'
            });
        }

        await prisma.savingsGoal.delete({
            where: { id: goalId }
        });

        res.json({
            success: true,
            message: 'Meta de ahorro eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar meta de ahorro:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

module.exports = router;
