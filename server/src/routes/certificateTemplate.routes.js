import { Router } from "express";
import {
    createTemplate,
    getUserTemplates,
    deleteTemplate
} from "../controllers/certificateTemplate.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Create a new certificate template (protected)
router.route("/templates").post(verifyJWT, createTemplate);

// Fetch all templates for the logged-in user (protected)
router.route("/templates").get(verifyJWT, getUserTemplates);

// Delete a specific template by ID (protected)
router.route("/templates/:id").delete(verifyJWT, deleteTemplate);

export default router;