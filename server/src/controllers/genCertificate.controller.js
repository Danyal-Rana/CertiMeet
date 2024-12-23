import GenCertificate from "../models/genCertificate.model.js";
import File from "../models/file.model.js";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

const generateCertificates = async (req, res) => {
    try {
        const { fileId, templateId, fieldMapping } = req.body; // User input

        // Step 1: Validate inputs
        if (!fileId || !templateId || !fieldMapping) {
            return res.status(400).json({
                success: false,
                message: "File ID, Template ID, and Field Mapping are required.",
            });
        }

        // Step 2: Retrieve the file from the database
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({
                success: false,
                message: "Selected file not found.",
            });
        }

        const filePath = file.filePath; // Assuming file model has a 'filePath' field
        const templatePath = path.join(__dirname, `../templates/${templateId}.pdf`);

        // Step 3: Parse the file (utility function for CSV/Excel parsing required)
        const recipients = parseFile(filePath, fieldMapping); // [{ name, email, ... }]

        if (!recipients || recipients.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid data found in the file.",
            });
        }

        // Step 4: Load the template and generate certificates
        const templateBytes = fs.readFileSync(templatePath);
        const generatedCertificates = [];
        const errors = [];

        for (const recipient of recipients) {
            try {
                const pdfDoc = await PDFDocument.load(templateBytes);
                const pages = pdfDoc.getPages();
                const firstPage = pages[0];

                // Insert dynamic fields into the template
                for (const [field, value] of Object.entries(fieldMapping)) {
                    if (recipient[field]) {
                        firstPage.drawText(recipient[field], { x: 150, y: 500 - 50 * Object.keys(fieldMapping).indexOf(field), size: 12 });
                    } else {
                        throw new Error(`Missing value for field: ${field}`);
                    }
                }

                // Save generated PDF
                const pdfBytes = await pdfDoc.save();
                const outputPath = path.join(__dirname, `../output/${recipient.name}.pdf`);
                fs.writeFileSync(outputPath, pdfBytes);

                // Store certificate data
                generatedCertificates.push({
                    name: recipient.name,
                    email: recipient.email,
                    certificateUrl: `https://yourapp.com/output/${recipient.name}.pdf`,
                });
            } catch (err) {
                // Log errors for missing/incomplete data
                errors.push({ recipient, error: err.message });
            }
        }

        // Save generation details in the database
        const genCert = new GenCertificate({
            templateId,
            generatedBy: req.user._id,
            recipients: generatedCertificates,
            status: errors.length === 0 ? "completed" : "failed",
        });

        await genCert.save();

        // Step 5: Return response
        res.status(200).json({
            success: true,
            message: "Certificates generated.",
            data: { generatedCertificates, errors },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error generating certificates.",
            error,
        });
    }
};

// Function to compress certificates into a ZIP file
const downloadCertificatesAsZip = async (req, res) => {
    try {
        const { genCertificateId } = req.params;

        const genCert = await GenCertificate.findById(genCertificateId);
        if (!genCert) {
            return res.status(404).json({
                success: false,
                message: "Generated certificates not found.",
            });
        }

        const zip = new AdmZip();
        for (const recipient of genCert.recipients) {
            const filePath = path.join(__dirname, `../output/${recipient.name}.pdf`);
            zip.addLocalFile(filePath);
        }

        const zipPath = path.join(__dirname, "../output/certificates.zip");
        zip.writeZip(zipPath);

        res.download(zipPath, "certificates.zip", (err) => {
            if (err) {
                console.error(err);
                fs.unlinkSync(zipPath);
            } else {
                fs.unlinkSync(zipPath); // Clean up after download
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error downloading certificates.",
            error,
        });
    }
};

export { generateCertificates, downloadCertificatesAsZip };