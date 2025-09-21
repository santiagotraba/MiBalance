import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const userService = {
    // Obtener perfil del usuario
    async getProfile() {
        try {
            const response = await axios.get(`${API_URL}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error obteniendo perfil:', error);
            throw error;
        }
    },

    // Actualizar perfil del usuario
    async updateProfile(userData) {
        try {
            const response = await axios.put(`${API_URL}/users/profile`, userData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            throw error;
        }
    },

    // Cambiar contraseña
    async changePassword(passwordData) {
        try {
            const response = await axios.put(`${API_URL}/users/change-password`, passwordData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error cambiando contraseña:', error);
            throw error;
        }
    },

    // Eliminar cuenta
    async deleteAccount() {
        try {
            const response = await axios.delete(`${API_URL}/users/account`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error eliminando cuenta:', error);
            throw error;
        }
    }
};

export { userService };