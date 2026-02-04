import apiClient from '../services/api';

/**
 * Auth Service - handles authentication API calls.
 */
const authService = {
    /**
     * Login user with email and password.
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{token: string, user: object}>}
     */
    login: async (email, password) => {
        const response = await apiClient.post('/signin', { email, password });
        return response.data;
    },

    /**
     * Register a new user.
     * @param {object} userData - { name, email, password, phone }
     * @returns {Promise<{token: string, user: object}>}
     */
    signup: async (userData) => {
        const response = await apiClient.post('/signup', userData);
        return response.data;
    },

    /**
     * Register a new professional.
     * @param {object} professionalData
     * @returns {Promise<{token: string, user: object}>}
     */
    signupProfessional: async (professionalData) => {
        const response = await apiClient.post('/signup/professional', professionalData);
        return response.data;
    },

    /**
     * Get current user profile.
     * @returns {Promise<object>}
     */
    getProfile: async () => {
        const response = await apiClient.get('/user/profile');
        return response.data;
    },

    /**
     * Update user profile.
     * @param {object} data - Profile data to update
     * @returns {Promise<object>}
     */
    updateProfile: async (data) => {
        const response = await apiClient.put('/user/profile', data);
        return response.data;
    },

    /**
     * Logout - clears local storage.
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

export default authService;
