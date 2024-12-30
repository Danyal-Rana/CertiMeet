import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CertificatePage from './pages/CertificatePage';
import DashboardPage from './pages/DashboardPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import MeetingsPage from './pages/MeetingsPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import AccountSettingsPage from './pages/AccountSettingsPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/certificate" element={<CertificatePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/meetings" element={<MeetingsPage />} />
            <Route path="/otp" element={<OtpVerificationPage />} />
            <Route path="/account-settings" element={<AccountSettingsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;