import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Adjust the import according to your project structure

const OtpVerificationPage = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/user/verify-otp', { otp, email });
            if (response.data.success) {
                // OTP verified successfully
                navigate('/login');
            } else {
                setError(response.data.message || 'OTP verification failed. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        placeholder="Enter OTP"
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                        Verify OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerificationPage;