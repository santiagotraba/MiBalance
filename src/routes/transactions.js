const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validate, transactionSchema } = require('../utils/validation');

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Obtener transacciones del usuario
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            type,
            categoryId,
            startDate,
            endDate,
            search
        } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Construir filtros
        const whereClause = { userId: req.user.id };

        if (type && ['INCOME', 'EXPENSE'].includes(type)) {
            whereClause.type = type;
        }

        if (categoryId) {
            const categoryIdNum = parseInt(categoryId);
            if (!isNaN(categoryIdNum)) {
                whereClause.categoryId = categoryIdNum;
            }
        }

        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) whereClause.date.gte = new Date(startDate);
            if (endDate) whereClause.date.lte = new Date(endDate);
        }

        if (search) {
            whereClause.OR = [
                { description: { contains: search, mode: 'insensitive' } },
                { category: { name: { contains: search, mode: 'insensitive' } } }
            ];
        }

        // Obtener transacciones con paginación
        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where: whereClause,
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
                orderBy: { date: 'desc' },
                skip,
                take: limitNum
            }),
            prisma.transaction.count({ where: whereClause })
        ]);

        const totalPages = Math.ceil(total / limitNum);

        res.json({
            success: true,
            data: {
                transactions,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalItems: total,
                    itemsPerPage: limitNum,
                    hasNext: pageNum < totalPages,
                    hasPrev: pageNum > 1
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener transacciones:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Obtener una transacción específica
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const transactionId = parseInt(id);

        if (isNaN(transactionId)) {
            return res.status(400).json({
                success: false,
                error: 'ID de transacción inválido'
            });
        }

        const transaction = await prisma.transaction.findFirst({
            where: {
                id: transactionId,
                userId: req.user.id
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true
                    }
                }
            }
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transacción no encontrada'
            });
        }

        res.json({
            success: true,
            data: { transaction }
        });
    } catch (error) {
        console.error('Error al obtener transacción:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Crear nueva transacción
router.post('/', validate(transactionSchema), async (req, res) => {
    try {
        const { amount, description, type, categoryId, date } = req.body;

        // Verificar que la categoría pertenece al usuario (si se proporciona)
        if (categoryId) {
            const category = await prisma.category.findFirst({
                where: {
                    id: categoryId,
                    userId: req.user.id
                }
            });

            if (!category) {
                return res.status(400).json({
                    success: false,
                    error: 'Categoría no encontrada'
                });
            }

            // Verificar que el tipo de transacción coincida con el tipo de categoría
            if (category.type !== type) {
                return res.status(400).json({
                    success: false,
                    error: 'El tipo de transacción no coincide con el tipo de categoría'
                });
            }
        }

        const transaction = await prisma.transaction.create({
            data: {
                userId: req.user.id,
                amount,
                description,
                type,
                categoryId: categoryId || null,
                date: new Date(date)
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Transacción creada exitosamente',
            data: { transaction }
        });
    } catch (error) {
        console.error('Error al crear transacción:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Actualizar transacción
router.put('/:id', validate(transactionSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const transactionId = parseInt(id);
        const { amount, description, type, categoryId, date } = req.body;

        if (isNaN(transactionId)) {
            return res.status(400).json({
                success: false,
                error: 'ID de transacción inválido'
            });
        }

        // Verificar que la transacción existe y pertenece al usuario
        const existingTransaction = await prisma.transaction.findFirst({
            where: {
                id: transactionId,
                userId: req.user.id
            }
        });

        if (!existingTransaction) {
            return res.status(404).json({
                success: false,
                error: 'Transacción no encontrada'
            });
        }

        // Verificar que la categoría pertenece al usuario (si se proporciona)
        if (categoryId) {
            const category = await prisma.category.findFirst({
                where: {
                    id: categoryId,
                    userId: req.user.id
                }
            });

            if (!category) {
                return res.status(400).json({
                    success: false,
                    error: 'Categoría no encontrada'
                });
            }

            // Verificar que el tipo de transacción coincida con el tipo de categoría
            if (category.type !== type) {
                return res.status(400).json({
                    success: false,
                    error: 'El tipo de transacción no coincide con el tipo de categoría'
                });
            }
        }

        const transaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: {
                amount,
                description,
                type,
                categoryId: categoryId || null,
                date: new Date(date)
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                        icon: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Transacción actualizada exitosamente',
            data: { transaction }
        });
    } catch (error) {
        console.error('Error al actualizar transacción:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Eliminar transacción
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const transactionId = parseInt(id);

        if (isNaN(transactionId)) {
            return res.status(400).json({
                success: false,
                error: 'ID de transacción inválido'
            });
        }

        // Verificar que la transacción existe y pertenece al usuario
        const existingTransaction = await prisma.transaction.findFirst({
            where: {
                id: transactionId,
                userId: req.user.id
            }
        });

        if (!existingTransaction) {
            return res.status(404).json({
                success: false,
                error: 'Transacción no encontrada'
            });
        }

        await prisma.transaction.delete({
            where: { id: transactionId }
        });

        res.json({
            success: true,
            message: 'Transacción eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar transacción:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

module.exports = router;
