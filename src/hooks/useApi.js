import apiClient from '../services/api';

// Simple hook to access the axios instance if needed directly in components
// or to verify Auth headers are present.
const useApi = () => {
    return apiClient;
};

export default useApi;
