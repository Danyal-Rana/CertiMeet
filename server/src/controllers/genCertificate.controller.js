import puppeteer from "puppeteer"; // Adding puppeteer for HTML to PDF conversion
import File from "../models/file.model.js";
import CertificateTemplate from "../models/certificateTemplate.model.js";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import axios from "axios";
import path from "path";
import * as XLSX from "xlsx";
import csvParser from "csv-parser";
import QRCode from "qrcode";

// Helper to download files from URLs or handle raw content
const downloadFile = async (input, dest) => {
    if (input && input.startsWith('http')) {
        // If input is a URL, download the file
        const writer = fs.createWriteStream(dest);
        const response = await axios.get(input, { responseType: "stream" });
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
    } else {
        // If input is raw content (HTML), convert to PDF using Puppeteer
        if (input && input.startsWith('<html>')) {
            console.log("Converting HTML to PDF...");
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
    console.log(`Converted HTML to PDF: ${outputPath}`);
};

// Function to parse files (CSV or XLSX)
const parseFile = async (filePath, type) => {
    const data = [];
    if (type === "csv") {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (row) => data.push(row))
            .on("end", () => console.log("CSV parsing completed"));
    } else if (type === "xlsx") {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        return XLSX.utils.sheet_to_json(sheet);
    }
    return data;
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
        const templatePath = `./public/genCertificate/${template.name}`;

        // Download file if it's a URL
        await downloadFile(file.secure_url, filePath);
        console.log(`File has been downloaded to ${filePath}`);

        // Download template (convert if HTML or use as PDF)
        await downloadFile(template.htmlContent, templatePath);
        console.log(`Template has been downloaded to ${templatePath}`);

        // Parse the file (CSV, XLSX, etc.)
        const fileData = await parseFile(filePath, file.type);
        if (fileData.length === 0) {
            return res.status(400).json({ success: false, message: "No data found in the file" });
        }

        // Load PDF template
        const existingPdfBytes = fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        const generatedFiles = [];
        for (const row of fileData) {
            const pdf = await PDFDocument.load(existingPdfBytes);
            const pages = pdf.getPages();
            const page = pages[0];

            // Insert dynamic data from the fieldMapping
            Object.keys(fieldMapping).forEach((field) => {
                const text = row[fieldMapping[field]] || "N/A";
                page.drawText(text, { x: 50, y: 400, size: 12, color: rgb(0, 0, 0) });
            });

            // Add QR code to the certificate
            const qrBytes = await QRCode.toBuffer(`https://verify.url/certificate/${row.id}`);
            const qrImage = await pdf.embedPng(qrBytes);
            page.drawImage(qrImage, { x: 450, y: 50, width: 100, height: 100 });

            // Save the generated PDF file
            const pdfBytes = await pdf.save();
            const outputPath = `./certificates/${row[fieldMapping["name"]]}.pdf`;
            fs.writeFileSync(outputPath, pdfBytes);
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