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

            console.log(`For placeholder "${placeholder}" in HTML content, found column "${columnMatch}" in file.`);
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

            console.log("Processing row:", row);

            // Replace placeholders with corresponding data
            // Extract placeholders from the HTML content
            const placeholders = [...templateHtml.matchAll(/{{\s*(\w+)\s*}}/g)].map((match) => match[1]);
            console.log("Extracted placeholders:", placeholders);

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

            const nameField = row[fieldMapping["name"]] || `certificate_${Date.now()}`;
            const htmlFileName = `${htmlDir}/${nameField}.html`;
            const pdfFileName = `${pdfDir}/${nameField}.pdf`;

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


const downloadCertificates = (req, res) => {
    try {
        const certificatesDir = path.join(__dirname, "../public/pdfCertificates"); // Path to the folder containing PDFs
        const zipFilePath = path.join(__dirname, "../public/certificates.zip"); // Path to save the ZIP file

        // Create a ZIP file
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver("zip", { zlib: { level: 9 } }); // Set compression level

        output.on("close", () => {
            console.log(`ZIP file created: ${archive.pointer()} total bytes`);
            // Send the ZIP file for download
            res.download(zipFilePath, "certificates.zip", (err) => {
                if (err) throw err;

                // Clean up the ZIP file after download
                fs.unlinkSync(zipFilePath);
            });
        });

        archive.on("error", (err) => {
            throw err;
        });

        // Pipe archive data to the file
        archive.pipe(output);

        // Append all PDF files from the folder to the archive
        fs.readdirSync(certificatesDir).forEach((file) => {
            const filePath = path.join(certificatesDir, file);
            if (file.endsWith(".pdf")) {
                archive.file(filePath, { name: file });
            }
        });

        // Finalize the archive
        archive.finalize();
    } catch (error) {
        console.error("Error downloading certificates:", error);
        res.status(500).json({ message: "Failed to download certificates.", error });
    }
};


export { generateCertificates, downloadCertificates };