import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sendOtp } from '../services/otp.service.js';


// Change Password
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    // console.log(`User: ${user}`);
    // console.log(`Db password is ${user.password}`);
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized. Please log in again.' });
    }

    // Check if the current password is correct
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid current password.' });
    }

    // Hash the new password before saving
    user.password = newPassword;  // This will trigger the pre-save hook for hashing the password
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
    const existingUser = await User.findOne({ username: newUsername.toLowerCase() });
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

    // Ensure the email is not already taken
    const isMailTaken = await User.findOne({ email: newEmail.toLowerCase() });

    if (isMailTaken) {
        return res.status(400).json({ message: 'Email already taken. Please choose another.' });
    }

    // sending otp to old email
    const otpResponse = await sendOtp(user.email);

    if (!otpResponse.success) {
        return res.status(500).json({ message: 'Failed to send OTP to old email.' });
    }    

    user.email = newEmail;
    await user.save();

    return res.status(200).json({ message: 'Email changed successfully.' });
});

// Upload Avatar
const uploadAvatar = asyncHandler(async (req, res) => {
    console.log("Request file:", req.file);

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        console.log("Avatar file missing in request.");
        throw new ApiError(400, "Avatar file is required.");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // console.log("Avatar uploaded to Cloudinary:", avatar);

    if (!avatar?.url) {
        console.log("Failed to upload file to Cloudinary.");
        throw new ApiError(500, "Avatar uploading failed.");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { avatar: avatar.url }
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully."));
});

export { changePassword, changeFullName, changeUsername, changeEmail, uploadAvatar };