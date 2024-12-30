import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        const fetchUser = async () => {
            const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
            if (!token) {
                console.log('No token found, user is not authenticated');
                return;
            }

            try {
                const response = await api.get('/user/profile');
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};