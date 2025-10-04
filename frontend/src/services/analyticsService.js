import api from './api'

export const analyticsService = {
    async getBalance(startDate = null, endDate = null) {
        try {
            const params = {}
            if (startDate) params.startDate = startDate
            if (endDate) params.endDate = endDate

            const response = await api.get('/analytics/balance', { params })
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al obtener balance')
        }
    },

    async getCategoryBreakdown(type = null, startDate = null, endDate = null) {
        try {
            const params = {}
            if (type) params.type = type
            if (startDate) params.startDate = startDate
            if (endDate) params.endDate = endDate

            const response = await api.get('/analytics/categories', { params })
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al obtener desglose por categorías')
        }
    },

    async getMonthlyTrends(year = null, type = null) {
        try {
            const params = {}
            if (year) params.year = year
            if (type) params.type = type

            const response = await api.get('/analytics/monthly-trends', { params })
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al obtener tendencias mensuales')
        }
    },

    async getRecentTransactions(limit = 10) {
        try {
            const response = await api.get('/analytics/recent-transactions', {
                params: { limit }
            })
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al obtener transacciones recientes')
        }
    },

    async getSavingsStats() {
        try {
            const response = await api.get('/analytics/savings-stats')
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error al obtener estadísticas de ahorro')
        }
    },

    async getAnalytics(timeRange = '30') {
        try {
            // Calcular fechas basadas en el rango de tiempo
            const endDate = new Date();
            const startDate = new Date();
            
            switch (timeRange) {
                case '7':
                    startDate.setDate(endDate.getDate() - 7);
                    break;
                case '30':
                    startDate.setDate(endDate.getDate() - 30);
                    break;
                case '90':
                    startDate.setDate(endDate.getDate() - 90);
                    break;
                case '365':
                    startDate.setDate(endDate.getDate() - 365);
                    break;
                default:
                    startDate.setDate(endDate.getDate() - 30);
            }

            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];

            // Obtener todos los datos necesarios en paralelo
            const [balanceData, expenseCategories, incomeCategories, monthlyTrends] = await Promise.all([
                this.getBalance(startDateStr, endDateStr),
                this.getCategoryBreakdown('EXPENSE', startDateStr, endDateStr),
                this.getCategoryBreakdown('INCOME', startDateStr, endDateStr),
                this.getMonthlyTrends()
            ]);

            // Procesar datos para el formato esperado por el componente
            const analytics = {
                totalIncome: balanceData.data.totalIncome,
                totalExpense: balanceData.data.totalExpenses,
                balance: balanceData.data.balance,
                savingsRate: balanceData.data.totalIncome > 0 
                    ? ((balanceData.data.totalIncome - balanceData.data.totalExpenses) / balanceData.data.totalIncome) * 100 
                    : 0,
                
                expenseByCategory: expenseCategories.data.categories.map(cat => ({
                    category: cat.categoryName,
                    amount: cat.amount,
                    color: cat.categoryColor,
                    percentage: cat.percentage
                })),
                
                incomeByCategory: incomeCategories.data.categories.map(cat => ({
                    category: cat.categoryName,
                    amount: cat.amount,
                    color: cat.categoryColor,
                    percentage: cat.percentage
                })),
                
                monthlyTrend: monthlyTrends.data.monthlyData.slice(-6).map(month => ({
                    month: month.monthName,
                    income: month.income,
                    expense: month.expense
                })),
                
                topExpenses: expenseCategories.data.categories.slice(0, 5).map(cat => ({
                    category: cat.categoryName,
                    amount: cat.amount,
                    color: cat.categoryColor
                })),
                
                topIncomes: incomeCategories.data.categories.slice(0, 5).map(cat => ({
                    category: cat.categoryName,
                    amount: cat.amount,
                    color: cat.categoryColor
                }))
            };

            return analytics;
        } catch (error) {
            console.error('Error obteniendo analytics:', error);
            throw error;
        }
    }
}
