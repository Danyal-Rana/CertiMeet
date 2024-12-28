import { useState } from 'react';

const CertificatePage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState('');

    const handleFileChange = (event) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleTemplateChange = (event) => {
        setSelectedTemplate(event.target.value);
    };

    const handleGenerateCertificates = () => {
        // Implement certificate generation logic here
        console.log('Generating certificates...');
    };

    const handleSendEmails = () => {
        // Implement email sending logic here
        console.log('Sending certificates via email...');
    };

    const handleDeleteFromServer = () => {
        // Implement deletion logic here
        console.log('Deleting certificates from server...');
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
                        <div className="space-y-4">
                            <input
                                type="file"
                                className="w-full p-2 border rounded-md"
                                accept=".csv,.xlsx"
                                onChange={handleFileChange}
                            />
                            <a href="/add-file" className="text-custom hover:text-custom/80">
                                Add New File
                            </a>
                        </div>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Select Template</h3>
                        <div className="space-y-4">
                            <select
                                className="w-full p-2 border rounded-md"
                                value={selectedTemplate}
                                onChange={handleTemplateChange}
                            >
                                <option value="">Select a template</option>
                                <option value="template1">Template 1</option>
                                <option value="template2">Template 2</option>
                            </select>
                            <a href="/add-template" className="text-custom hover:text-custom/80">
                                Add New Template
                            </a>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <button
                        className="bg-custom text-white px-6 py-2 rounded-md"
                        onClick={handleGenerateCertificates}
                    >
                        Generate Certificates
                    </button>
                    <button
                        className="bg-green-600 text-white px-6 py-2 rounded-md"
                        onClick={handleSendEmails}
                    >
                        Send via Email
                    </button>
                    <button
                        className="bg-red-600 text-white px-6 py-2 rounded-md"
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