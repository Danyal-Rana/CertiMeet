import puppeteer from "puppeteer"; // For HTML to PDF conversion
import File from "../models/file.model.js";
import CertificateTemplate from "../models/certificateTemplate.model.js";
import fs from "fs";
import axios from "axios";
import path from "path";
import XLSX from "xlsx";
import csvParser from "csv-parser";
import QRCode from "qrcode";

// Helper: Download file
const downloadFile = async (url, dest) => {
    console.log(`Downloading file from ${url}`);
    const writer = fs.createWriteStream(dest);
    const response = await axios.get(url, { responseType: "stream" });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on("finish", () => {
            console.log(`File downloaded to ${dest}`);
            resolve();
        });
        writer.on("error", (err) => reject(err));
    });
};

// Helper: Extract column names from file
const extractColumnNames = async (filePath, type) => {
    console.log(`Extracting column names from file: ${filePath}`);
    if (type === "csv") {
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on("headers", (headers) => {
                    console.log("Column names extracted (CSV):", headers);
                    resolve(headers);
                })
                .on("error", (err) => reject(err));
        });
    } else if (type === "xlsx") {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const columnNames = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
            console.log("Column names extracted (XLSX):", columnNames);
            return columnNames;
        } catch (err) {
            console.error("Error extracting column names (XLSX):", err);
            throw err;
        }
    } else {
        throw new Error("Unsupported file type for column extraction");
    }
};

// Helper: Parse file data
const parseFile = async (filePath, type) => {
    console.log(`Parsing file data: ${filePath}`);
    if (type === "csv") {
        const data = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on("data", (row) => data.push(row))
                .on("end", () => {
                    console.log("File data parsed (CSV):", data);
                    resolve(data);
                })
                .on("error", (err) => reject(err));
        });
    } else {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet);
            console.log("File data parsed (XLSX):", data);
            return data;
        } catch (err) {
            console.error("Error parsing XLSX file:", err);
            return [];
        }
    }
};

// Helper: Convert HTML to PDF
const convertHtmlToPdf = async (htmlPath, pdfPath) => {
    console.log(`Converting HTML to PDF: ${htmlPath} -> ${pdfPath}`);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file://${path.resolve(htmlPath)}`, { waitUntil: "load" });
    await page.pdf({ path: pdfPath, printBackground: true });
    await browser.close();
    console.log(`PDF generated at ${pdfPath}`);
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

        const filePath = `./public/genCertificate/${file.fileName}`;
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
            const columnMatch = columnNames.find((col) => col.toLowerCase() === placeholder.toLowerCase());
            if (columnMatch) {
                fieldMapping[placeholder] = columnMatch;
            } else {
                fieldMapping[placeholder] = "N/A";
            }
        });

        const htmlDir = "./public/htmlCertificates";
        const pdfDir = "./public/certificates";
        if (!fs.existsSync(htmlDir)) fs.mkdirSync(htmlDir, { recursive: true });
        if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

        const generatedFiles = [];
        for (const row of fileData) {
            let htmlContent = templateHtml;

            placeholders.forEach((placeholder) => {
                const value = row[fieldMapping[placeholder]] || "N/A";
                htmlContent = htmlContent.replace(new RegExp(`{{${placeholder}}}`, "g"), value);
            });

            const qrCode = await QRCode.toDataURL(`https://verify.url/certificate/${row.id}`);
            htmlContent = htmlContent.replace(/{{qrcode}}/g, `<img src="${qrCode}" alt="QR Code" />`);

            const htmlFileName = `${htmlDir}/${row[fieldMapping["name"]] || "certificate"}.html`;
            const pdfFileName = `${pdfDir}/${row[fieldMapping["name"]] || "certificate"}.pdf`;

            fs.writeFileSync(htmlFileName, htmlContent, "utf-8");
            console.log(`HTML certificate generated: ${htmlFileName}`);

            await convertHtmlToPdf(htmlFileName, pdfFileName);
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

export { generateCertificates };