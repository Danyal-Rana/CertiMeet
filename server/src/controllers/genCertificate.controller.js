// import puppeteer from "puppeteer"; // Adding puppeteer for HTML to PDF conversion
// import File from "../models/file.model.js";
// import CertificateTemplate from "../models/certificateTemplate.model.js";
// import { PDFDocument, rgb } from "pdf-lib";
// import fs from "fs";
// import axios from "axios";
// import path from "path";
// import XLSX from "xlsx";
// import csvParser from "csv-parser";
// import QRCode from "qrcode";

// // Helper to download files from URLs or handle raw content
// const downloadFile = async (input, dest) => {
//     if (input && input.startsWith('http')) {
//         // If input is a URL, download the file
//         const writer = fs.createWriteStream(dest);
//         const response = await axios.get(input, { responseType: "stream" });
//         response.data.pipe(writer);
//         return new Promise((resolve, reject) => {
//             writer.on("finish", resolve);
//             writer.on("error", reject);
//         });
//     } else {
//         // If input is raw content (HTML), convert to PDF using Puppeteer
//         if (input && input.startsWith('<!DOCTYPE html>')) {
//             // console.log("Converting HTML to PDF...");
//             await convertHtmlToPdf(input, dest);
//         } else {
//             console.log("No valid content provided.");
//         }
//     }
// };

// // Function to convert HTML to PDF using Puppeteer
// const convertHtmlToPdf = async (htmlContent, outputPath) => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.setContent(htmlContent);
//     await page.pdf({ path: outputPath, format: 'A4' });
//     await browser.close();
//     // console.log(`Converted HTML to PDF: ${outputPath}`);
// };

// // Function to parse files (CSV or XLSX)
// const parseFile = async (filePath, type) => {
//     const data = [];

//     // console.log('Parsing file:', filePath, 'with type:', type);

//     if (type === "csv") {
//         // Handle CSV files
//         return new Promise((resolve, reject) => {
//             fs.createReadStream(filePath)
//                 .pipe(csvParser())
//                 .on("data", (row) => data.push(row))
//                 .on("end", () => {
//                     // console.log("CSV parsing completed:", data);
//                     resolve(data);
//                 })
//                 .on("error", (error) => {
//                     console.error("Error parsing CSV:", error);
//                     reject(error);
//                 });
//         });
//     } else if (type === "xlsx" || type === "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
//         // Handle XLSX files and its MIME type
//         try {
//             if (!fs.existsSync(filePath)) {
//                 console.error("File does not exist:", filePath);
//                 return [];
//             }

//             const workbook = XLSX.readFile(filePath); // Read the XLSX file
//             const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Get the first sheet
//             const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON

//             // console.log("XLSX parsing completed:", jsonData);
//             return jsonData;
//         } catch (error) {
//             console.error("Error parsing XLSX file:", error);
//             return [];
//         }
//     }

//     console.error("Unsupported file type:", type);
//     return data; // Return an empty array if type is unsupported
// };

// // Function to generate certificates
// const generateCertificates = async (req, res) => {
//     try {
//         const { fileId, templateId, fieldMapping } = req.body;

//         // Fetch file and template
//         const file = await File.findById(fileId);
//         const template = await CertificateTemplate.findById(templateId);

//         if (!file || !template) {
//             return res.status(400).json({ success: false, message: "Invalid file or template ID" });
//         }

//         // Define file and template paths
//         const filePath = `./public/genCertificate/${file.fileName}`;
//         const templatePath = `./public/genCertificate/${template.templateName}.pdf`;

//         // Download file if it's a URL
//         await downloadFile(file.secure_url, filePath);
//         // console.log(`File has been downloaded to ${filePath}`);

//         // Download template (convert if HTML or use as PDF)
//         await downloadFile(template.htmlContent, templatePath);
//         // console.log(`Template has been downloaded to ${templatePath}`);

//         // Parse the file (CSV, XLSX, etc.)
//         const fileData = await parseFile(filePath, file.type);
//         if (fileData.length === 0) {
//             return res.status(400).json({ success: false, message: "No data found in the file" });
//         }

//         // Load PDF template
//         const existingPdfBytes = fs.readFileSync(templatePath);
//         // console.log("PDF template loaded successfully.");
//         const pdfDoc = await PDFDocument.load(existingPdfBytes);

//         const generatedFiles = [];
//         for (const row of fileData) {
//             const pdf = await PDFDocument.load(existingPdfBytes);
//             const pages = pdf.getPages();
//             const page = pages[0];
//             // console.log("Processing row:", row);

//             // Insert dynamic data from the fieldMapping
//             Object.keys(fieldMapping).forEach((field) => {
//                 const text = row[fieldMapping[field]] || "N/A";
            
//                 // Example of dynamic positioning based on field
//                 const positions = {
//                     name: { x: 100, y: 500 },
//                     date: { x: 100, y: 450 },
//                 };
            
//                 if (positions[field]) {
//                     page.drawText(text, {
//                         x: positions[field].x,
//                         y: positions[field].y,
//                         size: 12,
//                         color: rgb(0, 0, 0),
//                     });
//                 } else {
//                     console.warn(`No position defined for field: ${field}`);
//                 }
//             });
            
//             // console.log("Dynamic data inserted successfully.");

//             // Add QR code to the certificate
//             const qrBytes = await QRCode.toBuffer(`https://verify.url/certificate/${row.id}`);
//             const qrImage = await pdf.embedPng(qrBytes);
//             page.drawImage(qrImage, { x: 450, y: 50, width: 100, height: 100 });
//             // console.log("QR code added successfully.");

//             // Save the generated PDF file
//             const pdfBytes = await pdf.save();
//             // console.log("PDF saved successfully.");
//             const outputPath = `/CertiMeet/server/public/certificates/${row[fieldMapping["name"]]}.pdf`;
//             // console.log("Output path:", outputPath);
//             fs.writeFileSync(outputPath, pdfBytes);
//             // console.log("PDF file created:", outputPath);
//             generatedFiles.push(outputPath);
//         }

//         // Return success response with generated files
//         res.status(200).json({
//             success: true,
//             message: "Certificates generated successfully.",
//             files: generatedFiles,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Error generating certificates.", error });
//     }
// };


import puppeteer from "puppeteer"; // Adding puppeteer for HTML to PDF conversion
import File from "../models/file.model.js";
import CertificateTemplate from "../models/certificateTemplate.model.js";
import fs from "fs";
import axios from "axios";
import path from "path";
import XLSX from "xlsx";
import csvParser from "csv-parser";
import QRCode from "qrcode";

// Helper to download files from URLs or handle raw content
const downloadFile = async (input, dest) => {
    if (input && input.startsWith('http')) {
        const writer = fs.createWriteStream(dest);
        const response = await axios.get(input, { responseType: "stream" });
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
    } else {
        if (input && input.startsWith('<!DOCTYPE html>')) {
            await convertHtmlToPdf(input, dest);
        } else {
            console.log("No valid content provided.");
        }
    }
};

// Function to convert HTML to PDF using Puppeteer
const convertHtmlToPdf = async (htmlContent, outputPath) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({ path: outputPath, format: 'A4' });
    await browser.close();
};

// Function to parse files (CSV or XLSX)
const parseFile = async (filePath, type) => {
    const data = [];
    if (type === "csv") {
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on("data", (row) => data.push(row))
                .on("end", () => resolve(data))
                .on("error", reject);
        });
    } else if (type === "xlsx" || type === "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        try {
            if (!fs.existsSync(filePath)) {
                console.error("File does not exist:", filePath);
                return [];
            }
            const workbook = XLSX.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            return XLSX.utils.sheet_to_json(sheet);
        } catch (error) {
            console.error("Error parsing XLSX file:", error);
            return [];
        }
    }
    console.error("Unsupported file type:", type);
    return data;
};

// Function to replace placeholders in HTML template
const replacePlaceholders = (htmlTemplate, fieldMapping, row) => {
    let html = htmlTemplate;
    Object.keys(fieldMapping).forEach((field) => {
        const placeholder = `{{${field}}}`;
        html = html.replace(new RegExp(placeholder, "g"), row[fieldMapping[field]] || "N/A");
    });
    return html;
};

// Function to generate certificates
const generateCertificates = async (req, res) => {
    try {
        const { fileId, templateId, fieldMapping } = req.body;

        // Fetch file and template
        const file = await File.findById(fileId);
        const template = await CertificateTemplate.findById(templateId);

        if (!file || !template) {
            return res.status(400).json({ success: false, message: "Invalid file or template ID" });
        }

        // Define file and template paths
        const filePath = `./public/genCertificate/${file.fileName}`;
        const templatePath = `./public/genCertificate/${template.templateName}.pdf`;

        // Download file if it's a URL
        await downloadFile(file.secure_url, filePath);

        // Parse the file (CSV, XLSX, etc.)
        const fileData = await parseFile(filePath, file.type);
        if (fileData.length === 0) {
            return res.status(400).json({ success: false, message: "No data found in the file" });
        }

        // Read the HTML template
        const htmlTemplate = fs.readFileSync(templatePath, "utf8");

        const generatedFiles = [];
        for (const row of fileData) {
            // Replace placeholders with actual data
            console.log("Processing row:", row);
            const populatedHtml = replacePlaceholders(htmlTemplate, fieldMapping, row);

            // Generate QR code and embed it
            const qrCodeUrl = `https://verify.url/certificate/${row.id}`;
            const qrImagePath = `./public/qrCodes/${row[fieldMapping["name"]]}-qr.png`;
            await QRCode.toFile(qrImagePath, qrCodeUrl);
            const qrImageTag = `<img src="file://${path.resolve(qrImagePath)}" alt="QR Code" width="100" height="100">`;
            const finalHtml = populatedHtml.replace("{{qrCode}}", qrImageTag);

            // Convert the populated HTML to PDF
            const outputPath = `/CertiMeet/server/public/certificates/${row[fieldMapping["name"]]}.pdf`;
            // await convertHtmlToPdf(finalHtml, outputPath);
            generatedFiles.push(outputPath);
        }

        // Return success response with generated files
        res.status(200).json({
            success: true,
            message: "Certificates generated successfully.",
            files: generatedFiles,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error generating certificates.", error });
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