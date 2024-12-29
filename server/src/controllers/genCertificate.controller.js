import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import XLSX from 'xlsx';
import csvParser from 'csv-parser';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import File from '../models/file.model.js';
import CertificateTemplate from '../models/certificateTemplate.model.js';
import GenCertificate from '../models/genCertificate.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: Parse file data
const parseFile = async (fileUrl, fileType) => {
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (fileType === 'csv') {
        return new Promise((resolve, reject) => {
            const results = [];
            csvParser()
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', reject)
                .write(buffer);
        });
    } else if (fileType === 'xlsx' || fileType === 'vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        return XLSX.utils.sheet_to_json(sheet);
    } else {
        throw new Error('Unsupported file type');
    }
};

// Helper: Convert HTML to PDF
const convertHtmlToPdf = async (htmlContent) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        landscape: true,
    });
    await browser.close();
    return pdfBuffer;
};

// Helper: Upload PDF to Cloudinary
const uploadPdfToCloudinary = async (pdfBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: 'raw', public_id: fileName },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(pdfBuffer);
    });
};

// Generate certificates
export const generateCertificates = async (req, res) => {
    try {
        const { fileId, templateId } = req.query;
        const userId = req.user._id; // Assuming you have user authentication middleware

        const file = await File.findById(fileId);
        const template = await CertificateTemplate.findById(templateId);

        if (!file || !template) {
            return res.status(400).json({ success: false, message: 'Invalid file or template ID' });
        }

        const fileData = await parseFile(file.secure_url, file.type);

        if (fileData.length === 0) {
            return res.status(400).json({ success: false, message: 'File is empty' });
        }

        const placeholders = template.placeholders.map(p => p.replace(/[{}]/g, '').trim().toLowerCase());
        const fieldMapping = {};
        const columnNames = Object.keys(fileData[0]);

        placeholders.forEach(placeholder => {
            const columnMatch = columnNames.find(col => col.toLowerCase() === placeholder);
            fieldMapping[placeholder] = columnMatch || placeholder;
        });

        const generatedCertificates = [];

        for (const row of fileData) {
            let htmlContent = template.htmlContent;

            placeholders.forEach(placeholder => {
                const value = row[fieldMapping[placeholder]] || 'N/A';
                htmlContent = htmlContent.replace(new RegExp(`{{\\s*${placeholder}\\s*}}`, 'gi'), value);
            });

            const pdfBuffer = await convertHtmlToPdf(htmlContent);
            const fileName = `certificate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const uploadResult = await uploadPdfToCloudinary(pdfBuffer, fileName);

            generatedCertificates.push({
                name: row.name || 'Recipient',
                email: row.email || '',
                certificateUrl: uploadResult.secure_url,
            });
        }

        const genCertificate = new GenCertificate({
            templateId: templateId,
            generatedBy: userId,
            recipients: generatedCertificates,
            status: 'completed',
        });

        await genCertificate.save();

        res.status(200).json({
            success: true,
            message: 'Certificates generated and stored successfully',
            generatedCertificateId: genCertificate._id,
        });
    } catch (error) {
        console.error('Error generating certificates:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating certificates',
            error: error.message,
        });
    }
};

// Download all certificates as ZIP
export const downloadAllCertificates = async (req, res) => {
    try {
        const { generatedCertificateId } = req.params;
        const genCertificate = await GenCertificate.findById(generatedCertificateId);

        if (!genCertificate) {
            return res.status(404).json({ error: 'Generated certificates not found.' });
        }

        const zipDir = path.join(__dirname, '../../public/zipFiles');
        const zipFilePath = path.join(zipDir, `certificates_${Date.now()}.zip`);

        await fs.mkdir(zipDir, { recursive: true });

        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            res.download(zipFilePath, 'certificates.zip', async (err) => {
                if (err) {
                    console.error('Error in download:', err);
                    res.status(500).json({ error: 'Failed to download certificates.' });
                } else {
                    console.log('Certificates successfully downloaded.');
                    await fs.unlink(zipFilePath);
                }
            });
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);

        for (const recipient of genCertificate.recipients) {
            const response = await fetch(recipient.certificateUrl);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            archive.append(buffer, { name: `${recipient.name}_certificate.pdf` });
        }

        await archive.finalize();
    } catch (error) {
        console.error('Error during zipping and downloading:', error);
        res.status(500).json({ error: 'Failed to download certificates.' });
    }
};

// Send certificates to emails
export const sendCertificatesToEmails = async (req, res) => {
    try {
        const { generatedCertificateId } = req.params;
        const genCertificate = await GenCertificate.findById(generatedCertificateId);

        if (!genCertificate) {
            return res.status(404).json({ error: 'Generated certificates not found.' });
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        for (const recipient of genCertificate.recipients) {
            if (!recipient.email) continue;

            const mailOptions = {
                from: `"CertiMeet" <${process.env.EMAIL_USER}>`,
                to: recipient.email,
                subject: 'Your Certificate',
                text: `Dear ${recipient.name},\n\nPlease find your certificate attached.\n\nBest regards,\nCertiMeet Team`,
                attachments: [
                    {
                        filename: `${recipient.name}_certificate.pdf`,
                        path: recipient.certificateUrl
                    }
                ]
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(200).json({ message: 'All certificates sent successfully!' });
    } catch (error) {
        console.error('Error sending certificates:', error);
        res.status(500).json({ error: 'Failed to send certificates.' });
    }
};

// Delete generated certificates
export const deleteGeneratedCertificates = async (req, res) => {
    try {
        const { generatedCertificateId } = req.params;
        const genCertificate = await GenCertificate.findById(generatedCertificateId);

        if (!genCertificate) {
            return res.status(404).json({ error: 'Generated certificates not found.' });
        }

        // Delete certificates from Cloudinary
        for (const recipient of genCertificate.recipients) {
            const publicId = recipient.certificateUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        }

        // Delete the GenCertificate document
        await GenCertificate.findByIdAndDelete(generatedCertificateId);

        res.status(200).json({ message: 'Generated certificates deleted successfully.' });
    } catch (error) {
        console.error('Error deleting generated certificates:', error);
        res.status(500).json({ error: 'Failed to delete generated certificates.' });
    }
};