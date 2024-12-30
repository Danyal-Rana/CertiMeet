import React, { useState, useContext } from 'react';
import { UserContext } from '../utils/UserContext';
import api from '../utils/api';

const AccountSettingsPage = () => {
    const { user, setUser } = useContext(UserContext);
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [username, setUsername] = useState(user?.username || '');
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (field, value) => {
        setLoading(true);
        setError('');
        setSuccess('');

        const endpointMap = {
            fullName: 'change-full-name',
            email: 'change-email',
            username: 'change-username'
        };

        try {
            const response = await api.put(`/user/${endpointMap[field]}`, { [field]: value });
            setSuccess(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
            setUser(response.data.user);
        } catch (error) {
            setError(`Error updating ${field}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
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
            setSuccess('Avatar updated successfully');
            setUser(response.data.user);
        } catch (error) {
            setError('Error updating avatar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Account Settings</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                
                <form onSubmit={(e) => { e.preventDefault(); handleUpdate('fullName', fullName); }}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Full Name'}
                    </button>
                </form>

                <form onSubmit={(e) => { e.preventDefault(); handleUpdate('email', email); }}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Email'}
                    </button>
                </form>

                <form onSubmit={(e) => { e.preventDefault(); handleUpdate('username', username); }}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Username'}
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
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Avatar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AccountSettingsPage;