import { Router } from "express";
import {
    uploadFile,
    getAllFiles,
    getFile,
    deleteAllFiles,
    deleteFile
} from "../controllers/file.controller.js"; 
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// File upload route (POST)
router.route("/upload").post(verifyJWT, upload.single("avatar"), uploadFile); 

// Get a specific file by its fileId (GET)
router.route("/getFile/:fileId").get(verifyJWT, getFile);

// Get all files of the logged-in user (GET)
router.route("/getAllFiles").get(verifyJWT, getAllFiles);


// Delete a specific file by fileId (DELETE)
router.route("/deleteFile/:fileId").delete(verifyJWT, deleteFile);

// Delete all files of the logged-in user (DELETE)
router.route("/deleteAllFiles").delete(verifyJWT, deleteAllFiles);

export default router;