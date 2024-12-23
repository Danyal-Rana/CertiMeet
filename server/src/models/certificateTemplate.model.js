import mongoose from 'mongoose';

const certificateTemplateSchema = new mongoose.Schema({
    templateName: { 
        type: String, 
        required: true 
    },
    htmlContent: { 
        type: String, 
        required: true 
    },
    placeholders: [
        { 
            type: String
        }
    ],
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    previewImage: { 
        type: String 
    },
}, { timestamps: true });

const CertificateTemplate= mongoose.model('CertificateTemplate', certificateTemplateSchema);

export default CertificateTemplate;