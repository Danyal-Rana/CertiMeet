import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import csvParser from 'csv-parser';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import File from '../models/file.model.js';
import CertificateTemplate from '../models/certificateTemplate.model.js';
import GenCertificate from '../models/genCertificate.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import QRCode from 'qrcode';
import crypto from 'crypto';

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
    
    // Set a landscape-oriented page size (A4 Landscape)
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
            top: '1cm',
            right: '1cm',
            bottom: '1cm',
            left: '1cm',
        },
    });
    
    await browser.close();
    return pdfBuffer;
};

// Helper: Upload PDF to Cloudinary
const uploadPdfToCloudinary = async (pdfBuffer, fileName) => {
    const tempDir = path.join(__dirname, '../../temp');
    const tempFilePath = path.join(tempDir, `${fileName}.pdf`);

    try {
        await fs.mkdir(tempDir, { recursive: true });
        await fs.writeFile(tempFilePath, pdfBuffer);
        const result = await uploadOnCloudinary(tempFilePath);
        return result;
    } catch (error) {
        console.error('Error in uploadPdfToCloudinary:', error);
        throw error;
    } finally {
        try {
            await fs.access(tempFilePath);
            await fs.unlink(tempFilePath);
            console.log('Temporary file deleted:', tempFilePath);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('Temporary file not found (already deleted):', tempFilePath);
            } else {
                console.error('Error deleting temporary file:', error);
            }
        }
    }
};

// Generate certificates
export const generateCertificates = async (req, res) => {
    try {
        const { fileId, templateId } = req.query;
        const userId = req.user._id;

        const file = await File.findById(fileId);
        const template = await CertificateTemplate.findById(templateId);

        if (!file || !template) {
            throw new ApiError(400, "Invalid file or template ID");
        }

        const fileData = await parseFile(file.secure_url, file.type);

        if (fileData.length === 0) {
            throw new ApiError(400, "File is empty");
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

            // Generate a unique verification code
            const verificationCode = crypto.randomBytes(16).toString('hex');

            // Generate QR code
            const qrCodeDataURL = await QRCode.toDataURL(`${process.env.FRONTEND_URL}/verify/${verificationCode}`);

            // Replace QR code placeholder
            htmlContent = htmlContent.replace('{{qrCode}}', `<img src="${qrCodeDataURL}" alt="Verification QR Code" style="width: 100px; height: 100px;" />`);

            placeholders.forEach(placeholder => {
                const value = row[fieldMapping[placeholder]] || 'N/A';
                htmlContent = htmlContent.replace(new RegExp(`{{\\s*${placeholder}\\s*}}`, 'gi'), value);
            });

            const pdfBuffer = await convertHtmlToPdf(htmlContent);
            const fileName = `certificate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const uploadResult = await uploadPdfToCloudinary(pdfBuffer, fileName);

            if (uploadResult) {
                generatedCertificates.push({
                    name: row.name || 'Recipient',
                    email: row.email || '',
                    certificateUrl: uploadResult.secure_url,
                    verificationCode
                });
            }
        }

        const genCertificate = new GenCertificate({
            templateId: templateId,
            generatedBy: userId,
            recipients: generatedCertificates,
            status: 'completed',
        });

        await genCertificate.save();

        res.status(200).json(
            new ApiResponse(200, { generatedCertificateId: genCertificate._id }, "Certificates generated and stored successfully")
        );
    } catch (error) {
        console.error('Error generating certificates:', error);
        throw new ApiError(500, "Error generating certificates: " + error.message);
    }
};

// Download all certificates as ZIP
export const downloadAllCertificates = async (req, res) => {
    try {
        const { generatedCertificateId } = req.params;
        const genCertificate = await GenCertificate.findById(generatedCertificateId);

        if (!genCertificate) {
            throw new ApiError(404, "Generated certificates not found.");
        }

        const zipDir = path.join(__dirname, '../../public/zipFiles');
        const zipFilePath = path.join(zipDir, `certificates_${Date.now()}.zip`);

        await fs.mkdir(zipDir, { recursive: true });

        const output = fsSync.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            res.download(zipFilePath, 'certificates.zip', async (err) => {
                if (err) {
                    console.error('Error in download:', err);
                    throw new ApiError(500, "Failed to download certificates.");
                } else {
                    console.log('Certificates successfully downloaded.');
                    await fs.unlink(zipFilePath);
                }
            });
        });

        archive.on('error', (err) => {
            throw new ApiError(500, "Error creating zip file: " + err.message);
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
        throw new ApiError(500, "Failed to download certificates: " + error.message);
    }
};

// Send certificates to emails
export const sendCertificatesToEmails = async (req, res) => {
    try {
        const { generatedCertificateId } = req.params;
        const genCertificate = await GenCertificate.findById(generatedCertificateId);

        if (!genCertificate) {
            throw new ApiError(404, "Generated certificates not found.");
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const failedEmails = [];

        for (const recipient of genCertificate.recipients) {
            if (!recipient.email) continue;
        
            try {
                // Fetch the PDF content
                const response = await fetch(recipient.certificateUrl);
                if (!response.ok) {
                    console.error(`Fetch error for ${recipient.certificateUrl}: ${response.statusText}`);
                    throw new Error(`Failed to fetch certificate: ${response.statusText}`);
                }
        
                const pdfBuffer = await response.arrayBuffer();
        
                const mailOptions = {
                    from: `"CertiMeet" <${process.env.EMAIL_USER}>`,
                    to: recipient.email,
                    subject: 'Your Certificate',
                    text: `Dear ${recipient.name},\n\nPlease find your certificate attached.\n\nBest regards,\nCertiMeet Team`,
                    attachments: [
                        {
                            filename: `${recipient.name}_certificate.pdf`,
                            content: Buffer.from(pdfBuffer),
                        },
                    ],
                };
        
                await transporter.sendMail(mailOptions);
                console.log(`Certificate sent successfully to ${recipient.email}`);
            } catch (error) {
                console.error(`Failed to send certificate to ${recipient.email}:`, error);
                failedEmails.push({ email: recipient.email, error: error.message });
            }
        }
        
        if (failedEmails.length > 0) {
            res.status(207).json(
                new ApiResponse(207, { failedEmails }, 'Some certificates could not be sent')
            );
        } else {
            res.status(200).json(
                new ApiResponse(200, null, 'All certificates sent successfully!')
            );
        }
    } catch (error) {
        console.error('Error sending certificates:', error);
        throw new ApiError(500, "Failed to send certificates: " + error.message);
    }
};

// Delete generated certificates
export const deleteGeneratedCertificates = async (req, res) => {
    try {
        const { generatedCertificateId } = req.params;
        const genCertificate = await GenCertificate.findById(generatedCertificateId);

        if (!genCertificate) {
            throw new ApiError(404, "Generated certificates not found.");
        }

        // Delete certificates from Cloudinary
        for (const recipient of genCertificate.recipients) {
            const publicId = recipient.certificateUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        }

        // Delete the GenCertificate document
        await GenCertificate.findByIdAndDelete(generatedCertificateId);

        res.status(200).json(
            new ApiResponse(200, null, 'Generated certificates deleted successfully.')
        );
    } catch (error) {
        console.error('Error deleting generated certificates:', error);
        throw new ApiError(500, "Failed to delete generated certificates: " + error.message);
    }
};

export const getUserCertificates = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        const certificates = await GenCertificate.find({ generatedBy: userId })
            .populate('templateId', 'templateName')
            .sort({ createdAt: -1 });

        if (!certificates || certificates.length === 0) {
            return res.status(200).json(
                new ApiResponse(200, [], "No certificates found for the user")
            );
        }

        const formattedCertificates = certificates.map(cert => ({
            _id: cert._id,
            templateName: cert.templateId ? cert.templateId.templateName : 'Unknown Template',
            createdAt: cert.createdAt,
            recipientsCount: cert.recipients ? cert.recipients.length : 0
        }));

        return res.status(200).json(
            new ApiResponse(200, formattedCertificates, "User certificates fetched successfully")
        );
    } catch (error) {
        console.error("Error in getUserCertificates:", error);
        throw new ApiError(500, "An error occurred while fetching user certificates");
    }
});

export const verifyCertificate = asyncHandler(async (req, res) => {
    const { verificationCode } = req.params;

    const certificate = await GenCertificate.findOne({ 'recipients.verificationCode': verificationCode });

    if (!certificate) {
        throw new ApiError(404, "Certificate not found");
    }

    const recipient = certificate.recipients.find(r => r.verificationCode === verificationCode);

    return res.status(200).json(
        new ApiResponse(200, { 
            isValid: true, 
            certificate: {
                _id: certificate._id,
                recipient: recipient.name,
                email: recipient.email,
                createdAt: certificate.createdAt
            }
        }, "Certificate verified successfully")
    );
});