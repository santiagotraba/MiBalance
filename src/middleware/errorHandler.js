const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log del error
    console.error(err);

    // Error de validación de Prisma
    if (err.code === 'P2002') {
        const message = 'Recurso duplicado';
        error = { message, statusCode: 400 };
    }

    // Error de registro no encontrado
    if (err.code === 'P2025') {
        const message = 'Recurso no encontrado';
        error = { message, statusCode: 404 };
    }

    // Error de validación de Joi
    if (err.isJoi) {
        const message = err.details.map(detail => detail.message).join(', ');
        error = { message, statusCode: 400 };
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        const message = 'Token inválido';
        error = { message, statusCode: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expirado';
        error = { message, statusCode: 401 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Error interno del servidor'
    });
};

module.exports = errorHandler;
