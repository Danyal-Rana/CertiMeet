import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OtpVerificationPage from '../pages/OtpVerificationPage';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/otp" element={<OtpVerificationPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;