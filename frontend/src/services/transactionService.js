import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const transactionService = {
    async getTransactions(params = {}) {
        try {
            const response = await axios.get(`${API_URL}/transactions`, {
                params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            // Verificar la estructura de la respuesta
            console.log('Respuesta del backend (transacciones):', response.data);
            
            // Si la respuesta tiene la estructura esperada
            if (response.data && response.data.data && response.data.data.transactions) {
                return response.data.data.transactions;
            }
            
            // Si la respuesta es directamente un array
            if (Array.isArray(response.data)) {
                return response.data;
            }
            
            // Si la respuesta tiene transacciones en el nivel superior
            if (response.data.transactions) {
                return response.data.transactions;
            }
            
            // Si no hay transacciones, devolver array vacío
            return [];
        } catch (error) {
            console.error('Error obteniendo transacciones:', error);
            throw error;
        }
    },

    async getTransaction(id) {
        try {
            const response = await axios.get(`${API_URL}/transactions/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.data.transaction;
        } catch (error) {
            console.error('Error obteniendo transacción:', error);
            throw error;
        }
    },

    async createTransaction(data) {
        try {
            const response = await axios.post(`${API_URL}/transactions`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.data.transaction;
        } catch (error) {
            console.error('Error creando transacción:', error);
            throw error;
        }
    },

    async updateTransaction(id, data) {
        try {
            const response = await axios.put(`${API_URL}/transactions/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data.data.transaction;
        } catch (error) {
            console.error('Error actualizando transacción:', error);
            throw error;
        }
    },

    async deleteTransaction(id) {
        try {
            const response = await axios.delete(`${API_URL}/transactions/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error eliminando transacción:', error);
            throw error;
        }
    }
}
