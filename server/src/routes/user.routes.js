import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    changePassword, 
    changeFullName, 
    changeUsername, 
    changeEmail, 
    uploadAvatar 
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Register user route (no avatar upload here)
router.route("/register").post(registerUser);

// Login user route
router.route("/login").post(loginUser);

// Secured routes (require JWT token)
router.route("/logout").post(verifyJWT, logoutUser);

// Password change route (protected)
router.route("/change-password").put(verifyJWT, changePassword);

// Change full name (protected)
router.route("/change-full-name").put(verifyJWT, changeFullName);

// Change username (protected)
router.route("/change-username").put(verifyJWT, changeUsername);

// Change email (protected)
router.route("/change-email").put(verifyJWT, changeEmail);

// Upload avatar (protected)
router.route("/upload-avatar").put(verifyJWT, upload.single("avatar"), uploadAvatar);

export default router;