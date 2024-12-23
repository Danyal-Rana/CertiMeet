import File from "../models/file.model.js";
import CertificateTemplate from "../models/certificateTemplate.model.js";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import axios from "axios";
import path from "path";
import * as XLSX from "xlsx";
import csvParser from "csv-parser";
import QRCode from "qrcode";

// Helper to download files from URLs
const downloadFile = async (url, dest) => {
    const writer = fs.createWriteStream(dest);
    const response = await axios.get(url, { responseType: "stream" });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
};

const parseFile = async (filePath, type) => {
    const data = [];
    if (type === "csv") {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (row) => data.push(row))
            .on("end", () => data);
    } else if (type === "xlsx") {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        return XLSX.utils.sheet_to_json(sheet);
    }
    return data;
};

const generateCertificates = async (req, res) => {
    try {
        const { fileId, templateId, fieldMapping } = req.body;

        // Fetch file and template
        const file = await File.findById(fileId);
        const template = await CertificateTemplate.findById(templateId);

        if (!file || !template) {
            return res.status(400).json({ success: false, message: "Invalid file or template ID" });
        }

        // Download file and template
        const filePath = `./temp/${file.fileName}`;
        const templatePath = `./temp/${template.name}`;
        await downloadFile(file.secure_url, filePath);
        await downloadFile(template.secure_url, templatePath);

        // Parse file
        const fileData = await parseFile(filePath, file.type);

        // Load PDF template
        const existingPdfBytes = fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        const generatedFiles = [];
        for (const row of fileData) {
            const pdf = await PDFDocument.load(existingPdfBytes);
            const pages = pdf.getPages();
            const page = pages[0];

            // Insert dynamic data
            Object.keys(fieldMapping).forEach((field) => {
                const text = row[fieldMapping[field]] || "N/A";
                page.drawText(text, { x: 50, y: 400, size: 12, color: rgb(0, 0, 0) });
            });

            // Add QR code
            const qrBytes = await QRCode.toBuffer(`https://verify.url/certificate/${row.id}`);
            const qrImage = await pdf.embedPng(qrBytes);
            page.drawImage(qrImage, { x: 450, y: 50, width: 100, height: 100 });

            // Save file
            const pdfBytes = await pdf.save();
            const outputPath = `./certificates/${row[fieldMapping["name"]]}.pdf`;
            fs.writeFileSync(outputPath, pdfBytes);
            generatedFiles.push(outputPath);
        }

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