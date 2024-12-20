import nodemailer from "nodemailer";
import { User } from "../models/user.model.js";
import { otpMailTemplate } from "../utils/mails.js";

// OTP Generation Logic
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Sending OTP Email Logic (using Nodemailer)
const sendOtpEmail = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // True for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const { subject, text, html } = otpMailTemplate(otp);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text,
        html,
    };

    await transporter.sendMail(mailOptions);
};

// Saving OTP to the database and sending email
const sendOtp = async (email) => {
    const otp = generateOtp();
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

    // Save OTP in the database
    const user = await User.findOneAndUpdate(
        { email },
        { otp, otpExpiration },
        { new: true }
    );

    if (!user) {
        throw new Error("User not found");
    }

    // Send OTP Email
    await sendOtpEmail(user.email, otp);

    return { success: true };
};

// Verifying OTP
const verifyOtp = async (email, otp) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    const now = new Date();
    if (now > user.otpExpiration) {
        throw new Error("OTP expired");
    }

    await User.findByIdAndUpdate(user._id, { otp: null, otpExpiration: null });

    return { success: true };
};

export { sendOtp, verifyOtp };