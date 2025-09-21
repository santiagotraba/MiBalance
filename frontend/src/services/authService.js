import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export const authService = {
    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password })
            return response.data
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Error al iniciar sesión'
            }
        }
    },

    async register(name, email, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, { name, email, password })
            return response.data
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Error al registrarse'
            }
        }
    },

    async verifyToken() {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return { success: false, error: 'No hay token' }
            }

            const response = await axios.get(`${API_URL}/auth/verify`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Token inválido'
            }
        }
    },

    async logout() {
        try {
            const token = localStorage.getItem('token')
            await axios.post(`${API_URL}/auth/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Error al cerrar sesión'
            }
        }
    }
}