import React from 'react';
import CertificateVerification from '../components/CertificateVerification';

const VerifyCertificatePage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Verify Certificate</h1>
            <CertificateVerification />
        </div>
    );
};

export default VerifyCertificatePage;