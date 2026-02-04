import apiClient from '../services/api';

/**
 * Professional Service - handles professional-related API calls.
 */
const professionalService = {
    /**
     * Search professionals with filters.
     * @param {object} params - { q, type, location, rating, page, limit }
     * @returns {Promise<{professionals: array, total: number}>}
     */
    search: async (params = {}) => {
        const response = await apiClient.get('/api/v1/professionals/search', { params });
        return response.data;
    },

    /**
     * Get professional by ID.
     * @param {string|number} id
     * @returns {Promise<object>}
     */
    getById: async (id) => {
        const response = await apiClient.get(`/api/v1/professionals/${id}`);
        return response.data.data;
    },

    /**
     * Get professional's services.
     * @param {string|number} professionalId
     * @returns {Promise<array>}
     */
    getServices: async (professionalId) => {
        const response = await apiClient.get(`/api/v1/professionals/${professionalId}/services`);
        return response.data;
    },

    /**
     * Get professional's availability.
     * @param {string|number} professionalId
     * @param {string} date - Date string (YYYY-MM-DD)
     * @returns {Promise<array>}
     */
    getAvailability: async (professionalId, date) => {
        const response = await apiClient.get(`/api/v1/professionals/${professionalId}/availability`, {
            params: { date }
        });
        return response.data;
    },

    /**
     * Get professional's reviews.
     * @param {string|number} professionalId
     * @param {object} params - { page, limit }
     * @returns {Promise<{reviews: array, total: number}>}
     */
    getReviews: async (professionalId, params = {}) => {
        const response = await apiClient.get(`/api/v1/professionals/${professionalId}/reviews`, { params });
        return response.data;
    },

    /**
     * Get all professional types/categories.
     * @returns {Promise<array>}
     */
    getTypes: async () => {
        const response = await apiClient.get('/api/v1/professional-types');
        return response.data;
    },
};

export default professionalService;
