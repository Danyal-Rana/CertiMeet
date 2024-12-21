import File from '../models/file.model.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import * as XLSX from 'xlsx'; // For Excel files

// Set up multer for file upload (this will save files locally, you can modify it to use cloud storage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/files'); // Local upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});

const upload = multer({ storage: storage }).single('file'); // Handle single file upload

// Controller function to upload file
const uploadFile = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'Error uploading file.',
                error: err
            });
        }

        const { userId } = req.user; // Get the user from JWT
        const fileType = path.extname(req.file.originalname).toLowerCase() === '.csv' ? 'csv' : 'xlsx'; // Check file type

        const newFile = new File({
            fileName: req.file.originalname,
            filePath: req.file.path,
            owner: userId,
            type: fileType,
        });

        await newFile.save();

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully.',
            file: newFile
        });
    });
};

// Controller function to process the uploaded CSV/Excel file and extract data (name, email)
const processFile = async (req, res) => {
    const { fileId } = req.params;

    try {
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found.' });
        }

        const data = [];
        const filePath = file.filePath;

        if (file.type === 'csv') {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    const { name, email } = row;
                    if (name && email) {
                        data.push({ name, email });
                    }
                })
                .on('end', async () => {
                    // Mark file as processed
                    file.status = 'processed';
                    await file.save();

                    res.status(200).json({
                        success: true,
                        message: 'File processed successfully.',
                        data
                    });
                });
        } else if (file.type === 'xlsx') {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
            const sheet = workbook.Sheets[sheetName];

            const rows = XLSX.utils.sheet_to_json(sheet);
            for (let row of rows) {
                const { name, email } = row;
                if (name && email) {
                    data.push({ name, email });
                }
            }

            // Mark file as processed
            file.status = 'processed';
            await file.save();

            res.status(200).json({
                success: true,
                message: 'File processed successfully.',
                data
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid file type.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error processing file.', error });
    }
};

// Get all files uploaded by the user
const getUserFiles = async (req, res) => {
    const { userId } = req.user; // Get user ID from JWT

    try {
        const files = await File.find({ owner: userId });
        res.status(200).json({
            success: true,
            message: 'Files fetched successfully.',
            files
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching files.', error });
    }
};

export { uploadFile, processFile, getUserFiles };