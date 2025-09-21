const express = require('express');
const prisma = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validate, categorySchema } = require('../utils/validation');

const router = express.Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Obtener todas las categorías del usuario
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        const whereClause = { userId: req.user.id };

        if (type && ['INCOME', 'EXPENSE'].includes(type)) {
            whereClause.type = type;
        }

        const categories = await prisma.category.findMany({
            where: whereClause,
            orderBy: [
                { type: 'asc' },
                { name: 'asc' }
            ],
            include: {
                _count: {
                    select: { transactions: true }
                }
            }
        });

        res.json({
            success: true,
            data: { categories }
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Obtener una categoría específica
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const categoryId = parseInt(id);

        if (isNaN(categoryId)) {
            return res.status(400).json({
                success: false,
                error: 'ID de categoría inválido'
            });
        }

        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                userId: req.user.id
            },
            include: {
                _count: {
                    select: { transactions: true }
                }
            }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Categoría no encontrada'
            });
        }

        res.json({
            success: true,
            data: { category }
        });
    } catch (error) {
        console.error('Error al obtener categoría:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Crear nueva categoría
router.post('/', validate(categorySchema), async (req, res) => {
    try {
        const { name, type, color, icon } = req.body;

        // Verificar si ya existe una categoría con el mismo nombre y tipo
        const existingCategory = await prisma.category.findFirst({
            where: {
                userId: req.user.id,
                name,
                type
            }
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                error: 'Ya existe una categoría con este nombre y tipo'
            });
        }

        const category = await prisma.category.create({
            data: {
                userId: req.user.id,
                name,
                type,
                color: color || '#3B82F6',
                icon
            }
        });

        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: { category }
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Actualizar categoría
router.put('/:id', validate(categorySchema), async (req, res) => {
    try {
        const { id } = req.params;
        const categoryId = parseInt(id);
        const { name, type, color, icon } = req.body;

        if (isNaN(categoryId)) {
            return res.status(400).json({
                success: false,
                error: 'ID de categoría inválido'
            });
        }

        // Verificar que la categoría existe y pertenece al usuario
        const existingCategory = await prisma.category.findFirst({
            where: {
                id: categoryId,
                userId: req.user.id
            }
        });

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                error: 'Categoría no encontrada'
            });
        }

        // Verificar si ya existe otra categoría con el mismo nombre y tipo
        const duplicateCategory = await prisma.category.findFirst({
            where: {
                userId: req.user.id,
                name,
                type,
                id: { not: categoryId }
            }
        });

        if (duplicateCategory) {
            return res.status(400).json({
                success: false,
                error: 'Ya existe una categoría con este nombre y tipo'
            });
        }

        const category = await prisma.category.update({
            where: { id: categoryId },
            data: {
                name,
                type,
                color: color || existingCategory.color,
                icon
            }
        });

        res.json({
            success: true,
            message: 'Categoría actualizada exitosamente',
            data: { category }
        });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Eliminar categoría
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const categoryId = parseInt(id);

        if (isNaN(categoryId)) {
            return res.status(400).json({
                success: false,
                error: 'ID de categoría inválido'
            });
        }

        // Verificar que la categoría existe y pertenece al usuario
        const existingCategory = await prisma.category.findFirst({
            where: {
                id: categoryId,
                userId: req.user.id
            }
        });

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                error: 'Categoría no encontrada'
            });
        }

        // Verificar si hay transacciones asociadas
        const transactionCount = await prisma.transaction.count({
            where: { categoryId }
        });

        if (transactionCount > 0) {
            return res.status(400).json({
                success: false,
                error: 'No se puede eliminar una categoría que tiene transacciones asociadas'
            });
        }

        await prisma.category.delete({
            where: { id: categoryId }
        });

        res.json({
            success: true,
            message: 'Categoría eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

module.exports = router;
