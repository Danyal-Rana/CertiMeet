import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../utils/UserContext';
import api from '../utils/api';

const AccountSettingsPage = () => {
    const { user, setUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
    });
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState({
        fullName: false,
        email: false,
        username: false,
        avatar: false,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                username: user.username || '',
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (field) => {
        setLoading(prev => ({ ...prev, [field]: true }));
        setError('');
        setSuccess('');

        const endpointMap = {
            fullName: 'change-full-name',
            email: 'change-email',
            username: 'change-username'
        };

        try {
            console.log(`Updating ${field} with value:`, formData[field]);
            const response = await api.put(`/user/${endpointMap[field]}`, { [`new${field.charAt(0).toUpperCase() + field.slice(1)}`]: formData[field] });
            console.log(`${field} update response:`, response);
            setSuccess(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
            setUser(prevUser => ({ ...prevUser, [field]: formData[field] }));
        } catch (error) {
            console.error(`Error updating ${field}:`, error.response || error);
            setError(error.response?.data?.message || `Error updating ${field}`);
        } finally {
            setLoading(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleAvatarUpload = async (e) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, avatar: true }));
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('avatar', avatar);

        try {
            const response = await api.post('/user/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Avatar update response:', response);
            setSuccess('Avatar updated successfully');
            setUser(prevUser => ({ ...prevUser, avatar: response.data.data.avatar }));
        } catch (error) {
            console.error('Error updating avatar:', error.response || error);
            setError(error.response?.data?.message || 'Error updating avatar');
        } finally {
            setLoading(prev => ({ ...prev, avatar: false }));
        }
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Account Settings</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}

                <form onSubmit={(e) => { e.preventDefault(); handleUpdate('fullName'); }}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading.fullName}>
                        {loading.fullName ? 'Updating...' : 'Update Full Name'}
                    </button>
                </form>

                <form onSubmit={(e) => { e.preventDefault(); handleUpdate('email'); }}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading.email}>
                        {loading.email ? 'Updating...' : 'Update Email'}
                    </button>
                </form>

                <form onSubmit={(e) => { e.preventDefault(); handleUpdate('username'); }}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading.username}>
                        {loading.username ? 'Updating...' : 'Update Username'}
                    </button>
                </form>

                <form onSubmit={handleAvatarUpload}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Avatar</label>
                        <input
                            type="file"
                            onChange={(e) => setAvatar(e.target.files[0])}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading.avatar}>
                        {loading.avatar ? 'Updating...' : 'Update Avatar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AccountSettingsPage;