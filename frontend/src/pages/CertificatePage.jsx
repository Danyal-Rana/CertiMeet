import React, { useState, useEffect } from "react";
import { getAllFiles, getUserTemplates, generateCertificates, sendCertificatesToEmails, deleteGeneratedCertificates, getUserCertificates, downloadCertificate } from "../utils/api";

const CertificatePage = () => {
    const [userFiles, setUserFiles] = useState([]);
    const [userTemplates, setUserTemplates] = useState([]);
    const [userCertificates, setUserCertificates] = useState([]);
    const [selectedFile, setSelectedFile] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [fileResponse, templateResponse, certificateResponse] = await Promise.all([
                getAllFiles(),
                getUserTemplates(),
                getUserCertificates()
            ]);
            setUserFiles(fileResponse.data.files || []);
            setUserTemplates(templateResponse.data.data || []);
            setUserCertificates(certificateResponse.data.certificates || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch data");
        }
        setLoading(false);
    };

    const handleGenerateCertificates = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await generateCertificates(selectedFile, selectedTemplate);
            await fetchData(); // Refresh the list of certificates
            alert("Certificates generated successfully");
        } catch (error) {
            setError("Failed to generate certificates");
        }
        setLoading(false);
    };

    const handleSendEmails = async (certificateId) => {
        setLoading(true);
        setError("");
        try {
            await sendCertificatesToEmails(certificateId);
            alert("Certificates sent successfully");
        } catch (error) {
            setError("Failed to send certificates via email");
        }
        setLoading(false);
    };

    const handleDeleteCertificates = async (certificateId) => {
        setLoading(true);
        setError("");
        try {
            await deleteGeneratedCertificates(certificateId);
            await fetchData(); // Refresh the list of certificates
            alert("Certificates deleted from server");
        } catch (error) {
            setError("Failed to delete certificates from server");
        }
        setLoading(false);
    };

    const handleDownloadCertificates = async (certificateId) => {
        setLoading(true);
        setError("");
        try {
            const response = await downloadCertificate(certificateId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificates_${certificateId}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setError("Failed to download certificates");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">Certificate Generation</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Select File</h3>
                        <select
                            className="w-full p-2 border rounded-md"
                            value={selectedFile}
                            onChange={(e) => setSelectedFile(e.target.value)}
                        >
                            <option value="">Select a file</option>
                            {userFiles.map((file) => (
                                <option key={file._id} value={file._id}>
                                    {file.fileName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Select Template</h3>
                        <select
                            className="w-full p-2 border rounded-md"
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                        >
                            <option value="">Select a template</option>
                            {userTemplates.map((template) => (
                                <option key={template._id} value={template._id}>
                                    {template.templateName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        className={`px-6 py-2 rounded-md ${selectedFile && selectedTemplate && !loading
                                ? "bg-black text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                        disabled={!selectedFile || !selectedTemplate || loading}
                        onClick={handleGenerateCertificates}
                    >
                        Generate Certificates
                    </button>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4">Your Certificates</h3>
                    {userCertificates.length === 0 ? (
                        <p>No certificates found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {userCertificates.map((cert) => (
                                <li key={cert._id} className="bg-white p-4 rounded-lg shadow">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{cert.templateName}</span>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleDownloadCertificates(cert._id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                            >
                                                Download
                                            </button>
                                            <button
                                                onClick={() => handleSendEmails(cert._id)}
                                                className="bg-green-500 text-white px-3 py-1 rounded-md"
                                            >
                                                Send Email
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCertificates(cert._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-md"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CertificatePage;