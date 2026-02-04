import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'; // Uses env variable or defaults to port 8080

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Add JWT token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Handle global errors (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
    (response) => {
        // Some APIs wrap data in { success: true, data: ... }
        // We can unwrap it here for convenience, or return full response
        // For consistency with typical axios usage, we'll return response
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized (Token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // TODO: Implement refresh token logic here if backend supports it
            // For now, just logout
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect to signin if not already there
            if (!window.location.pathname.includes('/signin')) {
                window.location.href = '/signin';
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
