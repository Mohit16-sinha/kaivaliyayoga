import apiClient from './api';

/**
 * Appointment Service - handles booking/appointment API calls for professionals.
 */
const appointmentService = {
    /**
     * Get all appointments for the current user (categorized).
     * @returns {Promise<{upcoming: array, past: array, cancelled: array}>}
     */
    getAll: async () => {
        const response = await apiClient.get('/user/appointments');
        const appointments = response.data.data || response.data || [];

        // Categorize appointments
        const now = new Date();
        const result = {
            upcoming: [],
            past: [],
            cancelled: []
        };

        appointments.forEach(apt => {
            if (apt.status === 'cancelled') {
                result.cancelled.push(apt);
            } else if (new Date(apt.start_time) < now || apt.status === 'completed') {
                result.past.push(apt);
            } else {
                result.upcoming.push(apt);
            }
        });

        return result;
    },

    /**
     * Create a new appointment with a professional.
     * @param {object} data - { professional_id, service_id, start_time, end_time, client_notes }
     * @returns {Promise<object>}
     */
    create: async (data) => {
        const response = await apiClient.post('/user/appointments', data);
        return response.data.data || response.data;
    },

    /**
     * Get appointment by ID.
     * @param {string|number} id
     * @returns {Promise<object>}
     */
    getById: async (id) => {
        const response = await apiClient.get(`/user/appointments/${id}`);
        return response.data.data || response.data;
    },

    /**
     * Cancel an appointment.
     * @param {string|number} id
     * @param {string} reason - Cancellation reason
     * @returns {Promise<object>}
     */
    cancel: async (id, reason = '') => {
        const response = await apiClient.delete(`/user/appointments/${id}`, {
            data: { reason }
        });
        return response.data;
    },

    /**
     * Reschedule an appointment.
     * @param {string|number} id
     * @param {string} startTime - ISO 8601 datetime (RFC3339)
     * @param {string} endTime - ISO 8601 datetime (RFC3339)
     * @returns {Promise<object>}
     */
    reschedule: async (id, startTime, endTime) => {
        const response = await apiClient.put(`/user/appointments/${id}`, {
            start_time: startTime,
            end_time: endTime
        });
        return response.data;
    },
};

export default appointmentService;
