import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            const userData = { username: res.data.username, role: res.data.role };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true, role: userData.role, user: userData };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            await api.post('/auth/register', userData);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
