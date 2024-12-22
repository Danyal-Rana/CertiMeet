import {uploadOnCloudinary} from '../utils/cloudinary.js';  // Assuming you have Cloudinary configuration in a separate file
import File from '../models/file.model.js';
import { v4 as uuidv4 } from 'uuid';  // To generate a unique name for files

// Handle file upload
const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        // console.log(`File is: ${file}`);
        if (!file) {
            // console.log('No file uploaded.');
            return res.status(400).json({
                success: false,
                message: "No file uploaded.",
            });
        }

        // Upload to Cloudinary
        const result = await uploadOnCloudinary(file.path);

        // Save file details in database
        const newFile = new File({
            fileName: file.originalname,
            owner: req.user._id,  // User ID from JWT token
            type: file.mimetype.split('/')[1],  // 'csv' or 'xlsx'
            public_id: result.public_id,
            secure_url: result.secure_url,
        });

        await newFile.save();

        res.status(200).json({
            success: true,
            message: "File uploaded successfully.",
            file: newFile,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error uploading file.",
            error,
        });
    }
};

// Get a specific file of the logged-in user
const getFile = async (req, res) => {
    try {
        const { fileId } = req.params;  // fileId will be the _id of the file document

        const file = await File.findOne({ _id: fileId, owner: req.user._id });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        res.status(200).json({
            success: true,
            file,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error retrieving file.",
            error,
        });
    }
};

// Get all files of the logged-in user
const getAllFiles = async (req, res) => {
    try {
        const files = await File.find({ owner: req.user._id });

        if (files.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No files found for this user.",
            });
        }

        res.status(200).json({
            success: true,
            files,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error retrieving files.",
            error,
        });
    }
};

// Delete a specific file of the logged-in user
const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;  

        const file = await File.findOne({ _id: fileId, owner: req.user._id });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        // Delete from Cloudinary
        // await cloudinary.uploader.destroy(file.public_id);

        // Delete from the database
        await File.deleteOne({ _id: fileId });

        res.status(200).json({
            success: true,
            message: "File deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting file.",
            error,
        });
    }
};


// Delete all files of the logged-in user
const deleteAllFiles = async (req, res) => {
    try {
        const files = await File.find({ owner: req.user._id });

        if (files.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No files found to delete.",
            });
        }

        // Delete files from Cloudinary
        // for (const file of files) {
        //     await cloudinary.uploader.destroy(file.public_id);
        // }

        // Delete files from database
        await File.deleteMany({ owner: req.user._id });

        res.status(200).json({
            success: true,
            message: "All files deleted successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting files.",
            error,
        });
    }
};

export { uploadFile, getFile, getAllFiles, deleteFile, deleteAllFiles };