import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('mz_user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        setUser(data);
        localStorage.setItem('mz_user', JSON.stringify(data));
        toast.success(`Welcome back, ${data.name}! 👋`);
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await axios.post('/api/auth/register', { name, email, password });
        setUser(data);
        localStorage.setItem('mz_user', JSON.stringify(data));
        toast.success(`Account created! Welcome, ${data.name} 🎉`);
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mz_user');
        toast.success('Logged out successfully');
    };

    const authHeader = () => user ? { Authorization: `Bearer ${user.token}` } : {};

    return (
        <AuthContext.Provider value={{ user, login, register, logout, authHeader }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
