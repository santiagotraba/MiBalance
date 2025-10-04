import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://mibalance-backend.onrender.com/api';

const savingsGoalService = {
    // Obtener todas las metas de ahorro
    async getSavingsGoals() {
        try {
            const response = await axios.get(`${API_URL}/savings-goals`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error obteniendo metas de ahorro:', error);
            throw error;
        }
    },

    // Alias para compatibilidad
    async getGoals() {
        return this.getSavingsGoals();
    },

    // Crear una nueva meta de ahorro
    async createSavingsGoal(goalData) {
        try {
            const response = await axios.post(`${API_URL}/savings-goals`, goalData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creando meta de ahorro:', error);
            throw error;
        }
    },

    // Actualizar una meta de ahorro
    async updateSavingsGoal(id, goalData) {
        try {
            const response = await axios.put(`${API_URL}/savings-goals/${id}`, goalData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error actualizando meta de ahorro:', error);
            throw error;
        }
    },

    // Eliminar una meta de ahorro
    async deleteSavingsGoal(id) {
        try {
            const response = await axios.delete(`${API_URL}/savings-goals/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error eliminando meta de ahorro:', error);
            throw error;
        }
    },

    // Agregar dinero a una meta
    async addAmountToGoal(id, amount) {
        try {
            const response = await axios.post(`${API_URL}/savings-goals/${id}/add-amount`,
                { amount },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error agregando dinero a la meta:', error);
            throw error;
        }
    }
};

export { savingsGoalService };