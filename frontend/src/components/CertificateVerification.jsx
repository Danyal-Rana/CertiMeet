import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../utils/api';

const CertificateVerification = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });

        scanner.render(onScanSuccess, onScanError);

        return () => {
            scanner.clear();
        };
    }, []);

    const onScanSuccess = async (decodedText) => {
        try {
            const verificationCode = decodedText.split('/').pop();
            const response = await api.get(`/genCertificates/verify/${verificationCode}`);
            setResult(response.data.data);
            setError(null);
        } catch (err) {
            setError('Invalid certificate or verification failed');
            setResult(null);
        }
    };

    const onScanError = (err) => {
        console.warn(err);
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Verify Certificate</h2>
            <div id="reader" className="mb-4"></div>
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