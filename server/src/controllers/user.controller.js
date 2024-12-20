import asyncHandler from 'express-async-handler';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';


// Change Password
const changePassword = asyncHandler(async (req, res) => {
    const { newPassword } = req.body;

    const user = req.user; // Get user object from the request
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized. Please log in again.' });
    }

    user.password = newPassword; // Password hashing is handled by the model pre-save hook
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully.' });
});

// Change Full Name
const changeFullName = asyncHandler(async (req, res) => {
    const { newFullName } = req.body;

    const user = req.user; // Get user object from the request
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized. Please log in again.' });
    }

    user.fullName = newFullName;
    await user.save();

    return res.status(200).json({ message: 'Full name updated successfully.' });
});

// Change Username
const changeUsername = asyncHandler(async (req, res) => {
    const { newUsername } = req.body;

    const user = req.user; // Get user object from the request
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized. Please log in again.' });
    }

    // Ensure the username is not already taken
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already taken. Please choose another.' });
    }

    user.username = newUsername;
    await user.save();

    return res.status(200).json({ message: 'Username updated successfully.' });
});

// Change Email
const changeEmail = asyncHandler(async (req, res) => {
    const { newEmail } = req.body;

    const user = req.user; // Get user object from the request
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized. Please log in again.' });
    }

    user.email = newEmail;
    await user.save();

    return res.status(200).json({ message: 'Email changed successfully.' });
});

// Upload Avatar
const uploadAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required.");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(500, "Avatar uploading failed.");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password");

    return res
    .status(200)
    .json (new ApiResponse(200, user, "Avatar updated successfully."));
});

export { changePassword, changeFullName, changeUsername, changeEmail, uploadAvatar };