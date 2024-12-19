import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        username:{
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'], // Only these two roles
            default: 'user',
        },
        secretKey: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Compare input password with stored password
userSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password); // Compare password for login
};

// Method to apply for admin role (using secret key)
userSchema.methods.applyForAdminRole = function (inputSecretKey) {
    const correctSecretKey = process.env.AdminKey; // The correct secret key to become admin

    if (inputSecretKey === correctSecretKey) {
        this.role = 'admin';
        this.secretKey = null; // Clear the secret key once validated
        return true;
    } else {
        return false; // Secret key is incorrect
    }
};

const User = mongoose.model('User', userSchema);
export default User;