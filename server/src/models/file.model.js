import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    fileName: { 
        type: String, 
        required: true 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['csv', 'xlsx'], 
        required: true 
    },
    public_id: { type: String },  // Cloudinary public_id
    secure_url: { type: String }, // Cloudinary secure_url
}, {
    timestamps: true
});

const File = mongoose.model('File', fileSchema);

export default File;