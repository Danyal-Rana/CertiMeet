import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendOtp, verifyOtp } from '../services/otp.service.js';

// Helper function to generate Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const myUser = await User.findById(userId);
        const accessToken = myUser.generateAccessToken();
        const refreshToken = myUser.generateRefreshToken();
        myUser.refreshToken = refreshToken;
        await myUser.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Token generation failed");
    }
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullName, password } = req.body;

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required.");
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
        throw new ApiError(409, "User already exists.");
    }

    let avatar = null;
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (avatarLocalPath) {
        try {
            avatar = await uploadOnCloudinary(avatarLocalPath);
        } catch (error) {
            throw new ApiError(500, "Failed to upload avatar.");
        }
    }

    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase(),
        avatar,
        isVerified: false,
    });

    try {
        req.session.email = email;
        await sendOtp(email);
    } catch (error) {
        await User.findByIdAndDelete(user._id);
        throw new ApiError(500, "Failed to send OTP.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User created. Please verify your email."));
});

// OTP for Signup (send OTP to email)
const requestOtpForSignup = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        if (existingUser.isVerified) {
            // User already has a verified account
            return res.status(400).json({ message: 'Email already registered and verified.' });
        } else {
            // User exists but is not verified; allow requesting a new OTP
            await sendOtp(email); // Resend OTP
            return res.status(200).json({ message: 'OTP resent to your email. Please verify your email.' });
        }
    }

    // If the user doesn't exist, handle as a new signup
    await sendOtp(email); // Send OTP for the first time
    return res.status(200).json({ message: 'OTP sent to your email. Please verify your email.' });
});

const verifyOtpForSignup = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    const email = req.session.email; // Get email from session

    if (!email) {
        return res.status(400).json({ message: "Email is missing. Please try again." });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        await verifyOtp(email, otp);

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiration = undefined;

        await user.save();

        return res.status(200).json({ message: "OTP verified successfully. Your account is now verified." });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// User login
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    // Ensure either email or username is provided
    if (!(email || username)) {
        throw new ApiError(400, "Email or Username is required.");
    }

    // Find the user by email or username
    const userExistence = await User.findOne({ $or: [{ username }, { email }] });
    if (!userExistence) {
        throw new ApiError(404, "User not found.");
    }

    // Verify the password
    const isPasswordValid = await userExistence.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password.");
    }

    // Set the email in session for OTP verification and redirect response
    req.session.email = userExistence.email;

    // Check if the user is verified
    if (!userExistence.isVerified) {
        return res.status(401).json({
            message: "Please verify your email to continue.",
            redirectTo: "/verify-otp", // URL for frontend to redirect
            email: userExistence.email, // Include email for frontend to pre-fill
        });
    }

    // Generate access and refresh tokens for verified users
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userExistence._id);
    const loggedInUser = await User.findById(userExistence._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true, // Set true for production with HTTPS
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully.")
        );
});

// Logout the user (clear refreshToken cookie)
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true });

    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out."));
});

export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    requestOtpForSignup, 
    verifyOtpForSignup,
};