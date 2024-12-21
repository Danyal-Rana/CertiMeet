import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// this configuration allows to upload files to cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if (! localFilePath) {
            return null;
        }

        // uploading the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })

        // file has been uploaded on cloudinary
        // console.log("File has been uploaded successfully on Cloudinary.", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch {
        fs.unlinkSync(localFilePath); // it will remove the locally save temp file as the upload operation got failed
        return null;
    }
};

export {uploadOnCloudinary};