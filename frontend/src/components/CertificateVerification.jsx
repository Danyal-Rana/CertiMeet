import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import api from '../utils/api';

const CertificateVerification = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleScan = async (data) => {
        if (data) {
            try {
                const verificationCode = data.text.split('/').pop();
                const response = await api.get(`/genCertificates/verify/${verificationCode}`);
                setResult(response.data.data);
                setError(null);
            } catch (err) {
                setError('Invalid certificate or verification failed');
                setResult(null);
            }
        }
    };

    const handleError = (err) => {
        console.error(err);
        setError('Error scanning QR code');
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Verify Certificate</h2>
            <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
            />
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {result && (
                <div className="mt-4 p-4 bg-green-100 rounded">
                    <p className="text-green-700">Certificate is valid!</p>
                    <p>Recipient: {result.certificate.recipient}</p>
                    <p>Generated on: {new Date(result.certificate.createdAt).toLocaleDateString()}</p>
                </div>
            )}
        </div>
    );
};

export default CertificateVerification;