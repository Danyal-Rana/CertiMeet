import CertificateTemplate from '../models/certificateTemplate.model.js';

const createTemplate = async (req, res) => {
    try {
        const { templateName, htmlContent } = req.body;

        // Extract placeholders like {{name}} from the HTML content
        const placeholders = Array.from(htmlContent.matchAll(/{{\w+}}/g)).map(match => match[0]);

        // Create a new template
        const newTemplate = await CertificateTemplate.create({
            templateName,
            htmlContent,
            placeholders,
            createdBy: req.user.id,
        });

        res.status(201).json({ success: true, data: newTemplate });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create template.', error });
    }
};

const getUserTemplates = async (req, res) => {
    try {
        const templates = await CertificateTemplate.find({ createdBy: req.user.id });
        res.status(200).json({ success: true, data: templates });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch templates.', error });
    }
};

const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await CertificateTemplate.findOneAndDelete({ _id: id, createdBy: req.user.id });

        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found.' });
        }

        res.status(200).json({ success: true, message: 'Template deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete template.', error });
    }
};

export { createTemplate, getUserTemplates, deleteTemplate };