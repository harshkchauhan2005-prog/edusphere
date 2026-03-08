const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|ppt|pptx|zip|txt|csv|xls|xlsx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (!(mimetype || extname)) {
            throw new Error('Error: Only documents, images, and archives are allowed!');
        }

        return {
            folder: 'edusphere_uploads',
            resource_type: 'auto', // Important for non-image files like PDF, ZIP
            public_id: `${file.fieldname}-${Date.now()}`
        };
    },
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 50000000 }, // 50MB
});

module.exports = upload;
