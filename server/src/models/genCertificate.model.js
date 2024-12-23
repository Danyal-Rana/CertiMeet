import mongoose from "mongoose";

const genCertificateSchema = new mongoose.Schema({
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CertificateTemplate",
        required: true,
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recipients: [
        {
            name: { type: String, required: true },
            email: { type: String, required: true },
            certificateUrl: { type: String }, // URL of the generated certificate
        },
    ],
    status: { 
        type: String, 
        enum: ["completed", "failed"], 
        default: "completed" 
    },
}, { timestamps: true});

const GenCertificate = mongoose.model("GenCertificate", genCertificateSchema);

export default GenCertificate;