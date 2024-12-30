import { Router } from "express";
import { 
    changePassword, 
    changeFullName, 
    changeUsername, 
    changeEmail, 
    uploadAvatar 
} from "../controllers/user.controller.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    verifyOtpForSignup
} from "../controllers/auth.controller.js"
import { verifyOtp } from "../services/otp.service.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";

const router = Router();

// Register user route (no avatar upload here)
router.route("/register").post(registerUser);

// Verify OTP route
router.route("/verify-otp").post(verifyOtpForSignup);

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
router.route("/upload-avatar").post(verifyJWT, upload.single("avatar"), uploadAvatar);

// Get user profile (protected)
router.route("/profile").get(verifyJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -refreshToken");
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile" });
    }
});

// Update user profile (protected)
router.route("/update-profile").put(verifyJWT, async (req, res) => {
    try {
        const { fullName, email, username, avatar } = req.body;
        const user = await User.findById(req.user._id);

        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (username) user.username = username;
        if (avatar) user.avatar = avatar;

        await user.save();
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile" });
    }
});

export default router;