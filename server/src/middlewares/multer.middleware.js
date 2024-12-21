import multer from "multer";
import path from "path";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

// To handle __dirname in ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve the temporary directory path
const tempDir = path.resolve(__dirname, "../public/temp");

// Ensure the directory exists
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir); // Set the upload destination
    },
    filename: function (req, file, cb) {
        // Generate a unique file name
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = path.extname(file.originalname); // Extract file extension
        const baseName = path.basename(file.originalname, extension);
        cb(null, `${baseName}-${uniqueSuffix}${extension}`);
    }
});

// Export the multer middleware
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
    fileFilter: (req, file, cb) => {
        // Allow only image files
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
        }
    },
});