import { Router } from "express";
import {
    createTemplate,
    getUserTemplates,
    deleteTemplate
} from "../controllers/certificateTemplate.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Create a new certificate template (protected)
router.route("/create-template").post(verifyJWT, createTemplate);

// Fetch all templates for the logged-in user (protected)
router.route("/get-templates").get(verifyJWT, getUserTemplates);

// Delete a specific template by ID (protected)
router.route("/delete-template/:id").delete(verifyJWT, deleteTemplate);

export default router;