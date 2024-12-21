import cloudinary from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }

        // Uploading the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // Remove the temp file
        fs.unlinkSync(localFilePath);

        // Return the secure URL
        return { url: response.secure_url }; // Explicitly return `secure_url`

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        fs.unlinkSync(localFilePath); // Remove the temp file in case of error
        return null;
    }
};

export { uploadOnCloudinary };