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
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await api.post('/user/logout');
            setUser(null);
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