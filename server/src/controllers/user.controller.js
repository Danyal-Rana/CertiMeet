import asyncHandler from 'express-async-handler';
import { User } from '../models/user.model.js';

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

// Change Avatar
const changeAvatar = asyncHandler(async (req, res) => {
    const { newAvatarUrl } = req.body;

    const user = req.user; // Get user object from the request
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized. Please log in again.' });
    }

    user.avatar = newAvatarUrl;
    await user.save();

    return res.status(200).json({ message: 'Avatar updated successfully.' });
});

export { changePassword, changeFullName, changeUsername, changeEmail, changeAvatar };