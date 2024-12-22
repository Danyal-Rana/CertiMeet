import {uploadOnCloudinary} from '../utils/cloudinary.js';  // Assuming you have Cloudinary configuration in a separate file
import File from '../models/file.model.js';
import { v4 as uuidv4 } from 'uuid';  // To generate a unique name for files

// Handle file upload
const uploadFile = async (req, res) => {
    try {
        const file = req.file;  // Assuming you're using multer to handle file uploads
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded.",
            });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: 'auto',  // Automatically determine file type (image, video, etc.)
            public_id: `certimeet/${uuidv4()}`,  // Generate a unique public_id
        });

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
const getUserFiles = async (req, res) => {
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
        const { fileId } = req.params;  // fileId will be the _id of the file document

        const file = await File.findOne({ _id: fileId, owner: req.user._id });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found.",
            });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(file.public_id);

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
        for (const file of files) {
            await cloudinary.uploader.destroy(file.public_id);  // Remove from Cloudinary
        }

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

export { uploadFile, getFile, getUserFiles, deleteFile, deleteAllFiles };