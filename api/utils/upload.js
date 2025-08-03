import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadPath = 'uploads/';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const multiUpload = multer({ storage }).array('images', 20);
const singleUpload = multer({ storage }).single('image');

import {
    singleImageUpload,
    multipleImageUpload,
    generateImageUrl,
    generateImageUrls,
    deleteImage,
    handleUploadErrors
} from '../middlewares/imageMiddleware.js';

export {
    multiUpload,
    singleUpload,
    singleImageUpload,
    multipleImageUpload,
    generateImageUrl,
    generateImageUrls,
    deleteImage,
    handleUploadErrors
};