import { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize state synchronously so a refresh doesn't immediately log the user out
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const userInfo = localStorage.getItem('userInfo');
        if (token && userInfo) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return JSON.parse(userInfo);
        }
        return null;
    });

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setUser(null);
        axios.defaults.headers.common['Authorization'] = '';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);