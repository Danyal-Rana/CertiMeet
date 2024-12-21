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

// Fetch a single template by ID
const getTemplateById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the template ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Template ID is required.",
            });
        }

        // Find the template in the database
        const template = await CertificateTemplate.findOne({ _id: id, createdBy: req.user.id });
        // console.log(`Template is: ${template}`);

        if (!template) {
            return res.status(404).json({
                success: false,
                message: "Template not found.",
            });
        }

        // Return the template
        res.status(200).json({
            success: true,
            message: "Template retrieved successfully.",
            template,
        });
    } catch (error) {
        console.error("Error fetching template:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve template.",
            error,
        });
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

// Delete all templates for the authenticated user
const deleteAllTemplates = async (req, res) => {
    try {
        const userId = req.user._id;  // Ensure this is coming from JWT payload

        // console.log("Deleting templates for userId:", userId);

        // Delete all templates belonging to the authenticated user
        const result = await CertificateTemplate.deleteMany({ createdBy: String(userId) });
        // console.log("Delete result:", result);

        // If no templates were found, notify the user
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No templates found to delete.",
            });
        }

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} templates deleted successfully.`,
        });
    } catch (error) {
        console.error("Error deleting all templates:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete templates.",
            error,
        });
    }
};

export { createTemplate, getTemplateById, getUserTemplates, deleteTemplate, deleteAllTemplates };