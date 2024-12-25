import puppeteer from "puppeteer";
import File from "../models/file.model.js";
import CertificateTemplate from "../models/certificateTemplate.model.js";
import fs from "fs";
import axios from "axios";
import path from "path";
import XLSX from "xlsx";
import csvParser from "csv-parser";
import QRCode from "qrcode";
import archiver from "archiver";
import { fileURLToPath } from 'url';
import nodemailer from "nodemailer";

// Helper: Download file
const downloadFile = async (url, dest) => {
    const writer = fs.createWriteStream(dest);
    const response = await axios.get(url, { responseType: "stream" });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
};

// Helper: Extract column names from file
const extractColumnNames = async (filePath, type) => {
    if (type === "csv") {
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on("headers", resolve)
                .on("error", reject);
        });
    } else {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        return XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
    }
};

// Helper: Parse file data
const parseFile = async (filePath, type) => {
    if (type === "csv") {
        const data = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on("data", (row) => data.push(row))
                .on("end", () => resolve(data))
                .on("error", reject);
        });
    } else {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        return XLSX.utils.sheet_to_json(sheet);
    }
};

// Helper: Convert HTML to PDF
const convertHtmlToPdf = async (htmlContent, outputPath) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "load" });

    // Set default certificate size (adjust if needed)
    await page.pdf({
        path: outputPath,
        format: "A4", // Adjust to "letter" or custom size if required
        printBackground: true,
        landscape: true, // For horizontal orientation
    });

    await browser.close();
};

// Generate certificates
const generateCertificates = async (req, res) => {
    try {
        const { fileId, templateId } = req.body;

        const file = await File.findById(fileId);
        const template = await CertificateTemplate.findById(templateId);

        if (!file || !template) {
            return res.status(400).json({ success: false, message: "Invalid file or template ID" });
        }

        const filePath = `./public/files/${file.fileName}`;
        const templateHtml = template.htmlContent;
        const placeholders = template.placeholders;

        await downloadFile(file.secure_url, filePath);

        const columnNames = await extractColumnNames(filePath, file.type);
        const fileData = await parseFile(filePath, file.type);

        if (!columnNames || columnNames.length === 0 || fileData.length === 0) {
            return res.status(400).json({ success: false, message: "File is empty or has no columns" });
        }

        const fieldMapping = {};
        placeholders.forEach((placeholder) => {
            const cleanPlaceholder = placeholder.replace(/{{\s*|\s*}}/g, "").toLowerCase();
            const columnMatch = columnNames.find((col) => col.toLowerCase() === cleanPlaceholder);

            // console.log(`For placeholder "${placeholder}" in HTML content, found column "${columnMatch}" in file.`);
            fieldMapping[`{{${cleanPlaceholder}}}`] = columnMatch || cleanPlaceholder; // Store cleaned mapping
        });
        // console.log("Field mapping:", fieldMapping);


        const htmlDir = "./public/htmlCertificates";
        const pdfDir = "./public/pdfCertificates";
        if (!fs.existsSync(htmlDir)) fs.mkdirSync(htmlDir, { recursive: true });
        if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

        const generatedFiles = [];
        for (const row of fileData) {
            let htmlContent = templateHtml;

            // console.log("Processing row:", row);

            // Replace placeholders with corresponding data
            // Extract placeholders from the HTML content
            const placeholders = [...templateHtml.matchAll(/{{\s*(\w+)\s*}}/g)].map((match) => match[1]);
            // console.log("Extracted placeholders:", placeholders);

            placeholders.forEach((placeholder) => {
                const cleanPlaceholder = placeholder.replace(/{{\s*|\s*}}/g, ""); // Clean "{{ }}" syntax
                const mappedColumn = fieldMapping[`{{${cleanPlaceholder}}}`]; // Ensure cleaned mapping is used
                const value = row[mappedColumn] || "N/A"; // Fetch the value from row using mapped column

                // console.log(`Replacing placeholder "${placeholder}" with value "${value}"`);
                // console.log(`Mapping: placeholder -> column -> value | ${placeholder} -> ${mappedColumn} -> ${value}`);

                // Replace placeholder in the HTML content
                htmlContent = htmlContent.replace(new RegExp(`{{\\s*${cleanPlaceholder}\\s*}}`, "g"), value);
            });



            // Add QR code dynamically (optional)
            // const qrCode = await QRCode.toDataURL(`https://verify.url/certificate/${row.id}`);
            // htmlContent = htmlContent.replace(/{{qrcode}}/g, `<img src="${qrCode}" alt="QR Code" />`);

            // const nameField = row[fieldMapping["name"]] || `certificate_${Date.now()}`;
            // const htmlFileName = `${htmlDir}/${nameField}.html`;
            // const pdfFileName = `${pdfDir}/${nameField}.pdf`;

            // Extract email address and sanitize it for the filename
            const emailField = row[fieldMapping["email"]];
            if (!emailField) {
                throw new Error("Email field is missing in the row data");
            }

            // Use the portion of the email address before '@' as the filename
            const emailNamePart = emailField.split("@")[0];
            const sanitizedEmailName = emailNamePart.replace(/[^a-zA-Z0-9]/g, "_");

            const htmlFileName = `${htmlDir}/${sanitizedEmailName}.html`;
            const pdfFileName = `${pdfDir}/${sanitizedEmailName}.pdf`;


            fs.writeFileSync(htmlFileName, htmlContent, "utf-8");
            // console.log(`HTML certificate generated: ${htmlFileName}`);

            await convertHtmlToPdf(htmlContent, pdfFileName);
            // console.log(`PDF certificate generated: ${pdfFileName}`);

            generatedFiles.push(pdfFileName);
        }

        res.status(200).json({
            success: true,
            message: "Certificates generated successfully",
            files: generatedFiles,
        });
    } catch (error) {
        console.error("Error generating certificates:", error);
        res.status(500).json({ success: false, message: "Error generating certificates", error });
    }
};

// downloading certificates as ZIP
const downloadAllCertificates = async (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    try {
        // Update the paths to point to the correct public folder in the server directory
        const certificatesDir = path.join(__dirname, '../../public/pdfCertificates');
        const zipDir = path.join(__dirname, '../../public/zipFiles');
        const zipFilePath = path.join(zipDir, 'certificates.zip');

        console.log('Certificates Directory:', certificatesDir);
        console.log('Zip Directory:', zipDir);
        console.log('Zip File Path:', zipFilePath);

        // Ensure the zipFiles directory exists
        if (!fs.existsSync(zipDir)) {
            fs.mkdirSync(zipDir, { recursive: true });
            console.log('Zip directory created.');
        }

        // Step 1: Create a zip file
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('open', () => {
            console.log('WriteStream successfully opened for:', zipFilePath);
        });

        output.on('close', () => {
            console.log(`Zip file created: ${zipFilePath} (${archive.pointer()} bytes)`);

            // Serve the zip file for download
            res.download(zipFilePath, 'certificates.zip', (err) => {
                if (err) {
                    console.error('Error in download:', err);
                } else {
                    console.log('Certificates successfully downloaded.');
                }
            });
        });

        archive.on('error', (err) => {
            console.error('Error in archiving process:', err);
            throw err;
        });

        archive.pipe(output);

        // Add all files in the certificates directory to the zip
        if (fs.existsSync(certificatesDir)) {
            archive.directory(certificatesDir, false);
        } else {
            console.error('Certificates directory does not exist:', certificatesDir);
            throw new Error('Certificates directory not found.');
        }

        // Finalize the archive
        await archive.finalize();
    } catch (error) {
        console.error('Error during zipping and downloading:', error);
        res.status(500).json({ error: 'Failed to download certificates.' });
    }
};

const sendCertificatesToEmails = async (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    try {
        // Fix the directory path to point to the correct 'public' folder
        const certificatesDir = path.join(__dirname, '../../public/pdfCertificates');
        console.log('Certificates Directory:', certificatesDir);

        // Extract email data from the request body
        const emailData = req.body.emailData; // Format: [{ name: "John", email: "john@example.com", fileName: "john.pdf" }, ...]

        if (!emailData || emailData.length === 0) {
            return res.status(400).json({ error: 'No email data provided.' });
        }

        // Configure Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // You can use other services like Outlook, Yahoo, etc.
            auth: {
                user: process.env.EMAIL_USER, // Email from .env file
                pass: process.env.EMAIL_PASS  // Password or app-specific password from .env file
            }
        });

        // Loop through email data and send certificates
        for (const entry of emailData) {
            const { name, email, fileName } = entry;
            const filePath = path.join(certificatesDir, fileName);

            // Check if the file exists
            if (!fs.existsSync(filePath)) {
                console.error(`Certificate file not found: ${filePath}`);
                continue;
            }

            // Email options
            const mailOptions = {
                from: `"CertiMeet" <${process.env.EMAIL_USER}>`, // Sender address
                to: email, // Recipient address
                subject: `Your Certificate, ${name}`, // Subject line
                text: `Dear ${name},\n\nPlease find your certificate attached.\n\nBest regards,\nCertiMeet Team`,
                attachments: [
                    {
                        filename: fileName,
                        path: filePath // Path to the certificate
                    }
                ]
            };

            // Send email
            await transporter.sendMail(mailOptions);
            console.log(`Certificate sent to: ${email}`);
        }

        res.status(200).json({ message: 'All certificates sent successfully!' });
    } catch (error) {
        console.error('Error sending certificates:', error);
        res.status(500).json({ error: 'Failed to send certificates.' });
    }
};

export { generateCertificates, downloadAllCertificates, sendCertificatesToEmails };