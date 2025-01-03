import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const SignupPage = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [passwordValidations, setPasswordValidations] = useState({
        lowercase: false,
        uppercase: false,
        number: false,
        specialChar: false,
    });

    const validatePassword = (password) => {
        const lowercase = /[a-z]/.test(password);
        const uppercase = /[A-Z]/.test(password);
        const number = /\d/.test(password);
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        setPasswordValidations({
            lowercase,
            uppercase,
            number,
            specialChar,
        });
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/user/register', {
                fullName,
                username,
                email,
                password
            });
            if (response.data.success) {
                // Registration successful, redirect to OTP verification
                navigate('/verify-otp', { state: { email } });
            } else {
                setError(response.data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-2 border rounded-md"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full p-2 border rounded-md"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded-md"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    <div className="text-sm text-gray-600">
                        <p>Password must contain:</p>
                        <ul className="list-disc pl-5">
                            <li className={passwordValidations.lowercase ? "text-green-500" : "text-red-500"}>
                                Lowercase letters {passwordValidations.lowercase && "✔"}
                            </li>
                            <li className={passwordValidations.uppercase ? "text-green-500" : "text-red-500"}>
                                Uppercase letters {passwordValidations.uppercase && "✔"}
                            </li>
                            <li className={passwordValidations.number ? "text-green-500" : "text-red-500"}>
                                Numbers {passwordValidations.number && "✔"}
                            </li>
                            <li className={passwordValidations.specialChar ? "text-green-500" : "text-red-500"}>
                                Special characters {passwordValidations.specialChar && "✔"}
                            </li>
                        </ul>
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-2 rounded-md">
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-black">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;