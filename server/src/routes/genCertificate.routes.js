import { Router } from "express";
import { generateCertificates, downloadCertificatesAsZip } from "../controllers/genCertificate.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Route for generating certificates
router.route("/generate").post(verifyJWT, generateCertificates);
// router.post("/generate", verifyJWT, generateCertificates);

// Route for downloading certificates as ZIP
router.route("/download/:genCertificateId").get(verifyJWT, downloadCertificatesAsZip);
// router.get("/download/:genCertificateId", verifyJWT, downloadCertificatesAsZip);

export default router;