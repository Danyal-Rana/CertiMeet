import multer from "multer";

// Set up the storage engine for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/CertiMeet/server/public/temp/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Retains original file name
    }
});

// Initialize Multer with storage settings
const upload = multer({ storage: storage });

export { upload };