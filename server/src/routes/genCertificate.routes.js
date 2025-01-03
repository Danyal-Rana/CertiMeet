import { Router } from "express";
import { 
    generateCertificates, 
    downloadAllCertificates, 
    sendCertificatesToEmails, 
    deleteGeneratedCertificates,
    getUserCertificates,
    verifyCertificate
} from "../controllers/genCertificate.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Route for generating certificates
router.route("/generate").get(verifyJWT, generateCertificates);

// Route for downloading certificates as ZIP
router.route("/download/:generatedCertificateId").get(verifyJWT, downloadAllCertificates);

// Route for sending emails to the participants
router.route("/send-certificates/:generatedCertificateId").post(verifyJWT, sendCertificatesToEmails);

// Route for deleting generated certificates
router.route("/delete/:generatedCertificateId").delete(verifyJWT, deleteGeneratedCertificates);

// Route for getting user certificates
router.route("/user-certificates").get(verifyJWT, getUserCertificates);

// New route for verifying certificates
router.route("/verify/:verificationCode").get(verifyCertificate);

export default router;