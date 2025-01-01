import React, { useState, useEffect } from 'react';
import { uploadFile, getAllFiles, deleteFile } from '../utils/api';

const FileManager = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const response = await getAllFiles();
            if (response.success && Array.isArray(response.files)) {
                setFiles(response.files);
                setError('');
            } else {
                setError('Unexpected response format');
            }
        } catch (err) {
            setError('Failed to fetch files');
            console.error('Error fetching files:', err);
        }
        setLoading(false);
    };

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (selectedFile) {
            setLoading(true);
            try {
                await uploadFile(selectedFile);
                await fetchFiles();
                setSelectedFile(null);
            } catch (err) {
                setError('Failed to upload file');
                console.error('Error uploading file:', err);
            }
            setLoading(false);
        }
    };

    const handleDeleteFile = async (fileId) => {
        setLoading(true);
        try {
            await deleteFile(fileId);
            await fetchFiles();
        } catch (err) {
            setError('Failed to delete file');
            console.error('Error deleting file:', err);
        }
        setLoading(false);
    };

    return (
        <div>
            <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileSelect}
                className="mb-4"
            />
            {selectedFile && (
                <button
                    onClick={handleFileUpload}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
                >
                    Upload File
                </button>
            )}
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <h4 className="font-medium mt-4">Existing Files:</h4>
            {files.length === 0 ? (
                <p>No existing files</p>
            ) : (
                <ul className="space-y-2">
                    {files.map((file) => (
                        <li key={file._id} className="flex justify-between items-center">
                            <span>{file.fileName}</span>
                            <button
                                onClick={() => handleDeleteFile(file._id)}
                                className="text-red-500"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileManager;