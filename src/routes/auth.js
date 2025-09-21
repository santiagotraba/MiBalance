const express = require('express');
const prisma = require('../config/database');
const { hashPassword, verifyPassword, generateToken } = require('../utils/auth');
const { validate, registerSchema, loginSchema } = require('../utils/validation');

const router = express.Router();

// Registro de usuario
router.post('/register', validate(registerSchema), async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'El email ya está registrado'
            });
        }

        // Crear usuario
        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        // Crear categorías por defecto
        const defaultCategories = [
            { name: 'Salario', type: 'INCOME', color: '#10B981', icon: 'briefcase' },
            { name: 'Freelance', type: 'INCOME', color: '#3B82F6', icon: 'code' },
            { name: 'Inversiones', type: 'INCOME', color: '#8B5CF6', icon: 'trending-up' },
            { name: 'Alimentación', type: 'EXPENSE', color: '#F59E0B', icon: 'utensils' },
            { name: 'Transporte', type: 'EXPENSE', color: '#EF4444', icon: 'car' },
            { name: 'Entretenimiento', type: 'EXPENSE', color: '#EC4899', icon: 'film' },
            { name: 'Salud', type: 'EXPENSE', color: '#06B6D4', icon: 'heart' },
            { name: 'Educación', type: 'EXPENSE', color: '#84CC16', icon: 'book' },
            { name: 'Hogar', type: 'EXPENSE', color: '#F97316', icon: 'home' },
            { name: 'Otros', type: 'EXPENSE', color: '#6B7280', icon: 'more-horizontal' }
        ];

        await prisma.category.createMany({
            data: defaultCategories.map(cat => ({
                ...cat,
                userId: user.id
            }))
        });

        // Generar token
        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Login de usuario
router.post('/login', validate(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isValidPassword = await verifyPassword(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = generateToken(user.id);

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt
                },
                token
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Verificar token
router.get('/verify', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Token no proporcionado'
            });
        }

        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Token inválido'
        });
    }
});

module.exports = router;
