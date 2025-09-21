const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Token de acceso requerido'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verificar que el usuario aún existe
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Usuario no encontrado'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expirado'
            });
        }

        return res.status(403).json({
            error: 'Token inválido'
        });
    }
};

module.exports = { authenticateToken };
