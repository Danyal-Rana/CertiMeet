// OTP Email Template
export const otpMailTemplate = (otp) => {
    return {
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
        html: `
            <div>
                <h1>Your OTP Code</h1>
                <p>Your OTP code is: <strong>${otp}</strong></p>
                <p>It will expire in 10 minutes.</p>
            </div>
        `,
    };
};

// Welcome Email Template
export const welcomeMailTemplate = (username) => {
    return {
        subject: "Welcome to CertiMeet!",
        text: `Hi ${username},\n\nThank you for joining CertiMeet! We're excited to have you onboard.`,
        html: `
            <div>
                <h1>Welcome to CertiMeet!</h1>
                <p>Hi ${username},</p>
                <p>Thank you for joining CertiMeet! We're excited to have you onboard.</p>
            </div>
        `,
    };
};

// Password Reset Email Template
export const passwordResetMailTemplate = (resetLink) => {
    return {
        subject: "Reset Your Password",
        text: `Click the link to reset your password: ${resetLink}. If you didn't request a password reset, ignore this email.`,
        html: `
            <div>
                <h1>Reset Your Password</h1>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>If you didn't request a password reset, please ignore this email.</p>
            </div>
        `,
    };
};