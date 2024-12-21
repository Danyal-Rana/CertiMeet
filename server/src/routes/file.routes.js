import { Router } from 'express';
import { uploadFile, processFile, getUserFiles } from '../controllers/file.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Upload file route (protected, requires JWT token)
router.route('/upload').post(verifyJWT, uploadFile);

// Process uploaded file route (protected, requires JWT token)
router.route('/process/:fileId').post(verifyJWT, processFile);

// Get all files uploaded by the user (protected, requires JWT token)
router.route('/get-files').get(verifyJWT, getUserFiles);

export default router;