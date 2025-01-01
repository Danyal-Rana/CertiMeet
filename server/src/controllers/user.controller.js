import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sendOtp } from '../services/otp.service.js';

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role
    };

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        );
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
        throw new ApiError(401, 'Unauthorized. Please log in again.');
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(400, 'Invalid current password.');
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json(new ApiResponse(200, {}, 'Password changed successfully.'));
});

// Change Full Name
const changeFullName = asyncHandler(async (req, res) => {
    const { newFullName } = req.body;

    if (!newFullName || newFullName.trim() === '') {
        throw new ApiError(400, 'New full name is required.');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(401, 'Unauthorized. Please log in again.');
    }

    user.fullName = newFullName.trim();
    await user.save();

    return res.status(200).json(new ApiResponse(200, { user }, 'Full name updated successfully.'));
});

// Change Username
const changeUsername = asyncHandler(async (req, res) => {
    const { newUsername } = req.body;

    if (!newUsername || newUsername.trim() === '') {
        throw new ApiError(400, 'New username is required.');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(401, 'Unauthorized. Please log in again.');
    }

    const existingUser = await User.findOne({ username: newUsername.toLowerCase() });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        throw new ApiError(400, 'Username already taken. Please choose another.');
    }

    user.username = newUsername.toLowerCase();
    await user.save();

    return res.status(200).json(new ApiResponse(200, { user }, 'Username updated successfully.'));
});

// Change Email
const changeEmail = asyncHandler(async (req, res) => {
    const { newEmail } = req.body;

    if (!newEmail || newEmail.trim() === '') {
        throw new ApiError(400, 'New email is required.');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(401, 'Unauthorized. Please log in again.');
    }

    const isMailTaken = await User.findOne({ email: newEmail.toLowerCase() });
    if (isMailTaken && isMailTaken._id.toString() !== user._id.toString()) {
        throw new ApiError(400, 'Email already taken. Please choose another.');
    }

    const otpResponse = await sendOtp(user.email);
    if (!otpResponse.success) {
        throw new ApiError(500, 'Failed to send OTP to old email.');
    }    

    user.email = newEmail.toLowerCase();
    await user.save();

    return res.status(200).json(new ApiResponse(200, { user }, 'Email changed successfully.'));
});

// Upload Avatar
const uploadAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required.");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar?.url) {
        throw new ApiError(500, "Avatar uploading failed.");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { avatar: avatar.url }
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, { user }, "Avatar updated successfully."));
});

export { changePassword, changeFullName, changeUsername, changeEmail, uploadAvatar, loginUser };