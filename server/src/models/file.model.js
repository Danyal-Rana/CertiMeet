import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    fileName: { 
        type: String, 
        required: true 

    },
    filePath: { 
        type: String, 
        required: true 

    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 

    }, // Link to user who uploaded
    type: { 
        type: String, 
        enum: ['csv', 'xlsx'], 
        required: true 

    }, // File type: csv or excel
    status: { 
        type: String, 
        enum: ['pending', 'processed'], 
        default: 'pending' 

    }, // Track if the file has been processed
}, {
    timestamps: true
});

const File = mongoose.model('File', fileSchema);

export default File;