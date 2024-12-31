import React, { useState, useEffect } from 'react';
import { uploadFile, getAllFiles, deleteFile } from '../utils/api';

const FileManager = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const response = await getAllFiles();
            setFiles(response.data.files);
        } catch (err) {
            setError('Failed to fetch files');
        }
        setLoading(false);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setLoading(true);
            try {
                await uploadFile(file);
                await fetchFiles();
            } catch (err) {
                setError('Failed to upload file');
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
        }
        setLoading(false);
    };

    return (
        <div>
            <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
                className="mb-4"
            />
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
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
        </div>
    );
};

export default FileManager;