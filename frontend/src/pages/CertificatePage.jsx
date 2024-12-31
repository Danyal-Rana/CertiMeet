import React, { useState, useEffect } from "react";
import { getAllFiles, getUserTemplates, generateCertificates, sendCertificatesToEmails, deleteGeneratedCertificates } from "../utils/api";

const CertificatePage = () => {
    const [userFiles, setUserFiles] = useState([]);
    const [userTemplates, setUserTemplates] = useState([]);
    const [selectedFile, setSelectedFile] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [generatedCertificateId, setGeneratedCertificateId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchFilesAndTemplates();
    }, []);

    const fetchFilesAndTemplates = async () => {
        try {
            const [fileResponse, templateResponse] = await Promise.all([
                getAllFiles(),
                getUserTemplates()
            ]);
            setUserFiles(fileResponse.data.files || []);
            setUserTemplates(templateResponse.data.data || []);
        } catch (error) {
            console.error("Error fetching files or templates:", error);
            setError("Failed to fetch files and templates");
        }
    };

    const handleGenerateCertificates = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await generateCertificates(selectedFile, selectedTemplate);
            setGeneratedCertificateId(response.data.generatedCertificateId);
        } catch (error) {
            setError("Failed to generate certificates");
        }
        setLoading(false);
    };

    const handleSendEmails = async () => {
        setLoading(true);
        setError("");
        try {
            await sendCertificatesToEmails(generatedCertificateId);
            alert("Certificates sent successfully");
        } catch (error) {
            setError("Failed to send certificates via email");
        }
        setLoading(false);
    };

    const handleDeleteFromServer = async () => {
        setLoading(true);
        setError("");
        try {
            await deleteGeneratedCertificates(generatedCertificateId);
            setGeneratedCertificateId(null);
            alert("Certificates deleted from server");
        } catch (error) {
            setError("Failed to delete certificates from server");
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
                    <button
                        className={`px-6 py-2 rounded-md ${generatedCertificateId && !loading
                                ? "bg-green-600 text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                        disabled={!generatedCertificateId || loading}
                        onClick={handleSendEmails}
                    >
                        Send via Email
                    </button>
                    <button
                        className={`px-6 py-2 rounded-md ${generatedCertificateId && !loading
                                ? "bg-red-600 text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                        disabled={!generatedCertificateId || loading}
                        onClick={handleDeleteFromServer}
                    >
                        Delete from Server
                    </button>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default CertificatePage;