import { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement signup logic here
        console.log('Signing up with:', email, password);
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="text-sm text-gray-600">
                        <p>Password must contain:</p>
                        <ul className="list-disc pl-5">
                            <li>Lowercase letters</li>
                            <li>Uppercase letters</li>
                            <li>Numbers</li>
                            <li>Special characters</li>
                        </ul>
                    </div>
                    <button type="submit" className="w-full bg-custom text-white py-2 rounded-md">
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-custom">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;