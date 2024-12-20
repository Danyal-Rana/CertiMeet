import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { sendOtp, verifyOtp } from '../services/otp.service.js';  // Importing the OTP service

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
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
        throw new ApiError(409, "User already exists.");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // Send OTP before saving the user
    await sendOtp(email);

    // Create user with isVerified set to false
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        email,
        password,
        username: username.toLowerCase(),
        isVerified: false, // Mark as unverified initially
    });

    return res.status(200).json(new ApiResponse(200, {}, "User created. Please verify your email."));
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

// Verify OTP after Signup
const verifyOtpForSignup = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    try {
        // Verify the OTP using the otp.service
        await verifyOtp(email, otp);

        // Set user as verified
        user.isVerified = true;
        await user.save();

        return res.status(200).json({ message: 'OTP verified successfully. Your account is now verified.' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// User login
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!(email || username)) {
        throw new ApiError(400, "Email or Username is required");
    }

    const userExistence = await User.findOne({ $or: [{ username }, { email }] });
    if (!userExistence) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await userExistence.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    // Check if the user is verified
    if (!userExistence.isVerified) {
        throw new ApiError(401, "Please verify your email before logging in.");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userExistence._id);
    const loggedInUser = await User.findById(userExistence._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
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