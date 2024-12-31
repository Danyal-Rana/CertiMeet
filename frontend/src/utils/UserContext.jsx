import React, { createContext, useState, useEffect } from 'react';
import api from './api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await api.get('/user/profile');
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const logout = async () => {
        try {
            await api.post('/user/logout');
            setUser(null);
            localStorage.removeItem('user');
            document.cookie = 'accessToken=; Max-Age=0; path=/; domain=' + window.location.hostname;
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, logout, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};