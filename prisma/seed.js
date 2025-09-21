const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('password123', 12);

    const user = await prisma.user.upsert({
        where: { email: 'demo@mibalance.com' },
        update: {},
        create: {
            email: 'demo@mibalance.com',
            passwordHash: hashedPassword,
            name: 'Usuario Demo'
        }
    });

    console.log('✅ Usuario demo creado:', user.email);

    // Crear categorías por defecto
    const defaultCategories = [
        // Ingresos
        { name: 'Salario', type: 'INCOME', color: '#10B981', icon: 'briefcase' },
        { name: 'Freelance', type: 'INCOME', color: '#3B82F6', icon: 'code' },
        { name: 'Inversiones', type: 'INCOME', color: '#8B5CF6', icon: 'trending-up' },
        { name: 'Ventas', type: 'INCOME', color: '#F59E0B', icon: 'shopping-bag' },

        // Gastos
        { name: 'Alimentación', type: 'EXPENSE', color: '#F59E0B', icon: 'utensils' },
        { name: 'Transporte', type: 'EXPENSE', color: '#EF4444', icon: 'car' },
        { name: 'Entretenimiento', type: 'EXPENSE', color: '#EC4899', icon: 'film' },
        { name: 'Salud', type: 'EXPENSE', color: '#06B6D4', icon: 'heart' },
        { name: 'Educación', type: 'EXPENSE', color: '#84CC16', icon: 'book' },
        { name: 'Hogar', type: 'EXPENSE', color: '#F97316', icon: 'home' },
        { name: 'Ropa', type: 'EXPENSE', color: '#8B5CF6', icon: 'shirt' },
        { name: 'Otros', type: 'EXPENSE', color: '#6B7280', icon: 'more-horizontal' }
    ];

    const categories = [];
    for (const categoryData of defaultCategories) {
        const category = await prisma.category.create({
            data: {
                ...categoryData,
                userId: user.id
            }
        });
        categories.push(category);
    }

    console.log('✅ Categorías creadas:', categories.length);

    // Crear transacciones de ejemplo
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Obtener IDs de categorías
    const incomeCategories = categories.filter(cat => cat.type === 'INCOME');
    const expenseCategories = categories.filter(cat => cat.type === 'EXPENSE');

    const sampleTransactions = [
        // Ingresos del mes actual
        {
            amount: 2500.00,
            description: 'Salario mensual',
            type: 'INCOME',
            categoryId: incomeCategories[0].id,
            date: new Date(currentYear, currentMonth, 1)
        },
        {
            amount: 500.00,
            description: 'Proyecto freelance',
            type: 'INCOME',
            categoryId: incomeCategories[1].id,
            date: new Date(currentYear, currentMonth, 15)
        },
        {
            amount: 150.00,
            description: 'Dividendos de inversiones',
            type: 'INCOME',
            categoryId: incomeCategories[2].id,
            date: new Date(currentYear, currentMonth, 20)
        },

        // Gastos del mes actual
        {
            amount: 300.00,
            description: 'Supermercado semanal',
            type: 'EXPENSE',
            categoryId: expenseCategories[0].id,
            date: new Date(currentYear, currentMonth, 5)
        },
        {
            amount: 80.00,
            description: 'Gasolina',
            type: 'EXPENSE',
            categoryId: expenseCategories[1].id,
            date: new Date(currentYear, currentMonth, 8)
        },
        {
            amount: 25.00,
            description: 'Netflix',
            type: 'EXPENSE',
            categoryId: expenseCategories[2].id,
            date: new Date(currentYear, currentMonth, 10)
        },
        {
            amount: 120.00,
            description: 'Consulta médica',
            type: 'EXPENSE',
            categoryId: expenseCategories[3].id,
            date: new Date(currentYear, currentMonth, 12)
        },
        {
            amount: 200.00,
            description: 'Curso online',
            type: 'EXPENSE',
            categoryId: expenseCategories[4].id,
            date: new Date(currentYear, currentMonth, 18)
        },
        {
            amount: 150.00,
            description: 'Servicios básicos',
            type: 'EXPENSE',
            categoryId: expenseCategories[5].id,
            date: new Date(currentYear, currentMonth, 25)
        },
        {
            amount: 75.00,
            description: 'Ropa nueva',
            type: 'EXPENSE',
            categoryId: expenseCategories[6].id,
            date: new Date(currentYear, currentMonth, 28)
        }
    ];

    for (const transactionData of sampleTransactions) {
        await prisma.transaction.create({
            data: {
                ...transactionData,
                userId: user.id
            }
        });
    }

    console.log('✅ Transacciones de ejemplo creadas:', sampleTransactions.length);

    // Crear metas de ahorro de ejemplo
    const sampleGoals = [
        {
            name: 'Vacaciones de verano',
            targetAmount: 2000.00,
            currentAmount: 800.00,
            targetDate: new Date(currentYear + 1, 5, 1) // Junio del próximo año
        },
        {
            name: 'Fondo de emergencia',
            targetAmount: 5000.00,
            currentAmount: 2500.00,
            targetDate: new Date(currentYear + 1, 11, 31) // Diciembre del próximo año
        },
        {
            name: 'Nueva laptop',
            targetAmount: 1200.00,
            currentAmount: 1200.00,
            targetDate: new Date(currentYear, currentMonth + 1, 1),
            isAchieved: true
        }
    ];

    for (const goalData of sampleGoals) {
        await prisma.savingsGoal.create({
            data: {
                ...goalData,
                userId: user.id
            }
        });
    }

    console.log('✅ Metas de ahorro creadas:', sampleGoals.length);

    // Crear presupuestos mensuales de ejemplo
    const budgetCategories = expenseCategories.slice(0, 6); // Primeras 6 categorías de gastos
    const budgetAmounts = [400, 100, 50, 200, 300, 200]; // Montos de presupuesto

    for (let i = 0; i < budgetCategories.length; i++) {
        await prisma.monthlyBudget.create({
            data: {
                userId: user.id,
                categoryId: budgetCategories[i].id,
                budgetAmount: budgetAmounts[i],
                month: currentMonth + 1,
                year: currentYear
            }
        });
    }

    console.log('✅ Presupuestos mensuales creados:', budgetCategories.length);

    console.log('🎉 Seed completado exitosamente!');
    console.log('\n📋 Credenciales de prueba:');
    console.log('Email: demo@mibalance.com');
    console.log('Password: password123');
}

main()
    .catch((e) => {
        console.error('❌ Error durante el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
