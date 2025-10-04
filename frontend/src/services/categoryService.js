import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

            // Verificar la estructura de la respuesta
            console.log('Respuesta del backend:', response.data);

            // Si la respuesta tiene la estructura esperada
            if (response.data && response.data.data && response.data.data.categories) {
                return response.data.data.categories;
            }

            // Si la respuesta es directamente un array
            if (Array.isArray(response.data)) {
                return response.data;
            }

            // Si la respuesta tiene categorías en el nivel superior
            if (response.data.categories) {
                return response.data.categories;
            }

            // Si no hay categorías, devolver array vacío
            return [];
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
            return response.data.data.category;
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
            return response.data.data.category;
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
            return response.data.data.category;
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
