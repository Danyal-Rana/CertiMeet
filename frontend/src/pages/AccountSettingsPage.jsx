import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { UserContext } from '../utils/UserContext';

const AccountSettingsPage = () => {
    const { user, setUser } = useContext(UserContext);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/user/profile');
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Error fetching user data');
            }
        };

        fetchUser();
    }, [setUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleFileChange = (e) => {
        setUser({ ...user, avatar: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('fullName', user.fullName);
        formData.append('email', user.email);
        formData.append('username', user.username);
        if (user.avatar) {
            formData.append('avatar', user.avatar);
        }

        try {
            const response = await api.put('/user/update-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess('Profile updated successfully');
            setUser(response.data.user);
        } catch (error) {
            setError('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Account Settings</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={user.fullName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Avatar</label>
                        <input
                            type="file"
                            name="avatar"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AccountSettingsPage;