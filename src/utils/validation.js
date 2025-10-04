const Joi = require('joi');

// Validaciones de autenticación
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Validaciones de categorías
const categorySchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    type: Joi.string().valid('INCOME', 'EXPENSE').required(),
    color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
    icon: Joi.string().max(50).optional()
});

// Validaciones de transacciones
const transactionSchema = Joi.object({
    amount: Joi.number().positive().precision(2).required(),
    description: Joi.string().max(500).optional(),
    type: Joi.string().valid('INCOME', 'EXPENSE').required(),
    categoryId: Joi.number().integer().positive().optional(),
    date: Joi.date().max('now').required()
});

// Validaciones de metas de ahorro
const savingsGoalSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    targetAmount: Joi.number().positive().precision(2).required(),
    targetDate: Joi.date().min('now').optional()
});

// Validaciones de presupuestos
const budgetSchema = Joi.object({
    categoryId: Joi.number().integer().positive().required(),
    budgetAmount: Joi.number().positive().precision(2).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(2020).max(2030).required()
});

// Middleware de validación
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: error.details[0].message
            });
        }
        next();
    };
};

module.exports = {
    registerSchema,
    loginSchema,
    categorySchema,
    transactionSchema,
    savingsGoalSchema,
    budgetSchema,
    validate
};
