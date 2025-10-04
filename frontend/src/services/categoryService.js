import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

export const categoryService = {
    async getCategories(type = null) {
        try {
            const params = type ? { type } : {}
            const response = await axios.get(`${API_URL}/categories`, {
                params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error obteniendo categorías:', error);
            throw error;
        }
    },

    async getCategory(id) {
        try {
            const response = await axios.get(`${API_URL}/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error obteniendo categoría:', error);
            throw error;
        }
    },

    async createCategory(data) {
        try {
            const response = await axios.post(`${API_URL}/categories`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creando categoría:', error);
            throw error;
        }
    },

    async updateCategory(id, data) {
        try {
            const response = await axios.put(`${API_URL}/categories/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error actualizando categoría:', error);
            throw error;
        }
    },

    async deleteCategory(id) {
        try {
            const response = await axios.delete(`${API_URL}/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error eliminando categoría:', error);
            throw error;
        }
    }
}
