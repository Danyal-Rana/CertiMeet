import { useState, useEffect } from "react";
import axios from "axios";

const CertificatePage = () => {
    const [userFiles, setUserFiles] = useState([]); // User files list
    const [userTemplates, setUserTemplates] = useState([]); // User templates list
    const [selectedFile, setSelectedFile] = useState(""); // Selected file ID
    const [selectedTemplate, setSelectedTemplate] = useState(""); // Selected template ID
    const [isCertificatesGenerated, setCertificatesGenerated] = useState(false); // Generation state

    useEffect(() => {
        const fetchFilesAndTemplates = async () => {
            try {
                const fileResponse = await axios.get("/api/files/getAllFiles", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const templateResponse = await axios.get("/api/templates/get-templates", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                // Set the user files and templates
                setUserFiles(Array.isArray(fileResponse.data) ? fileResponse.data : []);
                setUserTemplates(Array.isArray(templateResponse.data) ? templateResponse.data : []);
            } catch (error) {
                console.error("Error fetching files or templates:", error);
                setUserFiles([]);
                setUserTemplates([]);
            }
        };

        fetchFilesAndTemplates();
    }, []);

    const handleGenerateCertificates = () => {
        console.log("Generating certificates...");
        setCertificatesGenerated(true); // Simulate certificate generation
    };

    const handleSendEmails = () => {
        console.log("Sending certificates via email...");
    };

    const handleDeleteFromServer = () => {
        console.log("Deleting certificates from server...");
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">Certificate Generation</h2>
                </div>

                {/* File Selection */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Select File</h3>
                        <div className="space-y-4">
                            <select
                                className="w-full p-2 border rounded-md"
                                value={selectedFile}
                                onChange={(e) => setSelectedFile(e.target.value)}
                            >
                                <option value="">Select a file</option>
                                {Array.isArray(userFiles) &&
                                    userFiles.map((file) => (
                                        <option key={file.id} value={file.id}>
                                            {file.name}
                                        </option>
                                    ))}
                            </select>
                            <a
                                href="/add-file"
                                className="bg-black text-white px-4 py-2 rounded-md inline-block text-center"
                            >
                                Add New File
                            </a>
                        </div>
                    </div>

                    {/* Template Selection */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Select Template</h3>
                        <div className="space-y-4">
                            <select
                                className="w-full p-2 border rounded-md"
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                            >
                                <option value="">Select a template</option>
                                {Array.isArray(userTemplates) &&
                                    userTemplates.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                            </select>
                            <a
                                href="/add-template"
                                className="bg-black text-white px-4 py-2 rounded-md inline-block text-center"
                            >
                                Add New Template
                            </a>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                    <button
                        className={`px-6 py-2 rounded-md ${
                            selectedFile && selectedTemplate
                                ? "bg-black text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                        disabled={!selectedFile || !selectedTemplate}
                        onClick={handleGenerateCertificates}
                    >
                        Generate Certificates
                    </button>
                    <button
                        className={`px-6 py-2 rounded-md ${
                            isCertificatesGenerated
                                ? "bg-green-600 text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                        disabled={!isCertificatesGenerated}
                        onClick={handleSendEmails}
                    >
                        Send via Email
                    </button>
                    <button
                        className={`px-6 py-2 rounded-md ${
                            isCertificatesGenerated
                                ? "bg-red-600 text-white"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                        disabled={!isCertificatesGenerated}
                        onClick={handleDeleteFromServer}
                    >
                        Delete from Server
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CertificatePage;