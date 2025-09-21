const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generar hash de contraseña
const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

// Verificar contraseña
const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Generar token JWT
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// Verificar token JWT
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken
};
