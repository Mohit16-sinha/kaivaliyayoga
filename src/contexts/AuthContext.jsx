import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial check on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } catch (e) {
                    console.error("Failed to parse stored user", e);
                    localStorage.removeItem('user');
                }
            } else if (token) {
                // If token but no user, try to fetch profile or logout
                logout();
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    // ... (rest of function)

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading Kaivalya Yoga...</div>;
    }

    const login = async (email, password) => {
        try {
            const response = await apiClient.post('/signin', { email, password });
            // Assuming response matches { token: "...", user: { ... } }
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return user;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            // userData should match backend requirements
            const response = await apiClient.post('/signup', userData);
            const { token, user } = response.data; // Ensure backend returns this on signup too

            // Auto login after signup? Often beneficial.
            // If backend handles login on signup (common), set it:
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
            }
            return user;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/signin';
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        role: user?.role // 'admin', 'user', 'professional' (mapped from API)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
