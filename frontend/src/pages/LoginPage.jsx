import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { UserContext } from '../utils/UserContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/user/login', { email, password });
            if (response.data.success) {
                setUser(response.data.data.user);
                navigate('/dashboard');
            } else {
                setError(response.data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            if (err.response && err.response.status === 401 && err.response.data.redirectTo === '/verify-otp') {
                navigate('/verify-otp', { state: { email: err.response.data.email } });
            } else {
                setError(err.response?.data?.message || 'Login failed. Please try again.');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-2 rounded-md">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;