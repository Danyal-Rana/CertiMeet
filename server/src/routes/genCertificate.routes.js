import { Router } from "express";
import { generateCertificates, downloadAllCertificates, sendCertificatesToEmails } from "../controllers/genCertificate.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Route for generating certificates
router.route("/generate").post(verifyJWT, generateCertificates);
// router.post("/generate", verifyJWT, generateCertificates);

// Route for downloading certificates as ZIP
router.route("/download").get(verifyJWT, downloadAllCertificates);
// router.get("/download/:genCertificateId", verifyJWT, downloadCertificatesAsZip);

// router for sending emails to the participants
router.route("/send-certificates").post(verifyJWT, sendCertificatesToEmails);

export default router;