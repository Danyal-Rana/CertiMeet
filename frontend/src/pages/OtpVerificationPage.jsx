import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

const OtpVerificationPage = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.email) {
            setEmail(location.state.email);
        }
    }, [location]);

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
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className="w-full p-2 border rounded-md"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full bg-black text-white py-2 rounded-md">
                        Verify OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerificationPage;