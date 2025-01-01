import React, { useState, useEffect } from 'react';
import { createTemplate, getUserTemplates, deleteTemplate } from '../utils/api';

const TemplateManager = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [newTemplate, setNewTemplate] = useState({ templateName: '', htmlContent: '' });
    const [selectedHtmlFile, setSelectedHtmlFile] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const response = await getUserTemplates();
            if (response.success && Array.isArray(response.data)) {
                setTemplates(response.data);
                setError('');
            } else {
                setError('Unexpected response format');
            }
        } catch (err) {
            setError('Failed to fetch templates');
            console.error('Error fetching templates:', err);
        }
        setLoading(false);
    };

    const handleHtmlFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setNewTemplate({
                    templateName: file.name.replace('.html', ''),
                    htmlContent: e.target.result
                });
            };
            reader.readAsText(file);
            setSelectedHtmlFile(file);
        }
    };

    const handleCreateTemplate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createTemplate(newTemplate);
            setNewTemplate({ templateName: '', htmlContent: '' });
            setSelectedHtmlFile(null);
            await fetchTemplates();
        } catch (err) {
            setError('Failed to create template');
            console.error('Error creating template:', err);
        }
        setLoading(false);
    };

    const handleDeleteTemplate = async (templateId) => {
        setLoading(true);
        try {
            await deleteTemplate(templateId);
            await fetchTemplates();
        } catch (err) {
            setError('Failed to delete template');
            console.error('Error deleting template:', err);
        }
        setLoading(false);
    };

    return (
        <div>
            <form onSubmit={handleCreateTemplate} className="mb-4">
                <input
                    type="file"
                    accept=".html"
                    onChange={handleHtmlFileSelect}
                    className="mb-2"
                />
                {selectedHtmlFile && (
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        Create Template
                    </button>
                )}
            </form>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <h4 className="font-medium mt-4">Existing Templates:</h4>
            {templates.length === 0 ? (
                <p>No existing templates</p>
            ) : (
                <ul className="space-y-2">
                    {templates.map((template) => (
                        <li key={template._id} className="flex justify-between items-center">
                            <span>{template.templateName}</span>
                            <button
                                onClick={() => handleDeleteTemplate(template._id)}
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

export default TemplateManager;