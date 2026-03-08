import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data.data);
                } catch (e) {
                    console.error('Failed to load full profile, falling back to token');
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        setUser({ id: payload.id, role: payload.role, name: payload.name });
                    } catch (err) {
                        logout();
                    }
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token,
        loading
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
