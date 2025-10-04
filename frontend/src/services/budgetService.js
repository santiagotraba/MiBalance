import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const budgetService = {
    // Obtener todos los presupuestos
    async getBudgets() {
        try {
            const response = await axios.get(`${API_URL}/budgets`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error obteniendo presupuestos:', error);
            throw error;
        }
    },

    // Crear un nuevo presupuesto
    async createBudget(budgetData) {
        try {
            const response = await axios.post(`${API_URL}/budgets`, budgetData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creando presupuesto:', error);
            throw error;
        }
    },

    // Actualizar un presupuesto
    async updateBudget(id, budgetData) {
        try {
            const response = await axios.put(`${API_URL}/budgets/${id}`, budgetData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error actualizando presupuesto:', error);
            throw error;
        }
    },

    // Eliminar un presupuesto
    async deleteBudget(id) {
        try {
            const response = await axios.delete(`${API_URL}/budgets/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error eliminando presupuesto:', error);
            throw error;
        }
    },

    // Obtener presupuestos por mes
    async getBudgetsByMonth(month) {
        try {
            const response = await axios.get(`${API_URL}/budgets/month/${month}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error obteniendo presupuestos por mes:', error);
            throw error;
        }
    }
};

export { budgetService };
