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
    }
}
