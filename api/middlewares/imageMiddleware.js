import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Sadece resim dosyaları kabul edilir!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 20
    }
});

const processImage = async (buffer, filename, quality = 80, maxWidth = 1200, maxHeight = 1200) => {
    try {
        const processedBuffer = await sharp(buffer)
            .resize(maxWidth, maxHeight, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({
                quality: quality,
                progressive: true
            })
            .toBuffer();

        const finalFilename = filename.replace(/\.[^/.]+$/, "") + '.jpg';
        const filePath = path.join(uploadPath, finalFilename);

        await fs.promises.writeFile(filePath, processedBuffer);

        return {
            filename: finalFilename,
            path: filePath,
            size: processedBuffer.length
        };
    } catch (error) {
        throw new Error(`Resim işleme hatası: ${error.message}`);
    }
};

const singleImageUpload = (fieldName = 'image', options = {}) => {
    const { quality = 80, maxWidth = 1200, maxHeight = 1200 } = options;

    return [
        upload.single(fieldName),
        async (req, res, next) => {
            try {
                if (!req.file) {
                    return next();
                }

                const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
                const filename = `${uniqueName}.jpg`;

                const result = await processImage(
                    req.file.buffer,
                    filename,
                    quality,
                    maxWidth,
                    maxHeight
                );

                req.file.filename = result.filename;
                req.file.path = result.path;
                req.file.size = result.size;
                req.file.processedUrl = `/uploads/${result.filename}`;

                next();
            } catch (error) {
                next(error);
            }
        }
    ];
};

const multipleImageUpload = (fieldName = 'images', maxCount = 10, options = {}) => {
    const { quality = 80, maxWidth = 1200, maxHeight = 1200 } = options;

    return [
        upload.array(fieldName, maxCount),
        async (req, res, next) => {
            try {
                if (!req.files || req.files.length === 0) {
                    return next();
                }

                const processedFiles = [];

                for (const file of req.files) {
                    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
                    const filename = `${uniqueName}.jpg`;

                    const result = await processImage(
                        file.buffer,
                        filename,
                        quality,
                        maxWidth,
                        maxHeight
                    );

                    processedFiles.push({
                        ...file,
                        filename: result.filename,
                        path: result.path,
                        size: result.size,
                        processedUrl: `/uploads/${result.filename}`
                    });
                }

                req.files = processedFiles;
                req.uploadedImageUrls = processedFiles.map(file => file.processedUrl);

                next();
            } catch (error) {
                next(error);
            }
        }
    ];
};

const generateImageUrl = (filename, baseUrl = process.env.BASE_URL || 'http://localhost:3000') => {
    if (!filename) return null;

    if (filename.startsWith('http')) {
        return filename;
    }

    if (filename.startsWith('/uploads/')) {
        return `${baseUrl}${filename}`;
    }

    if (baseUrl.endsWith('/uploads')) {
        return `${baseUrl}/${filename}`;
    }

    return `${baseUrl}/uploads/${filename}`;
};

const generateImageUrls = (filenames, baseUrl = process.env.BASE_URL || 'http://localhost:3000') => {
    if (!filenames) return [];

    if (Array.isArray(filenames)) {
        return filenames.map(filename => generateImageUrl(filename, baseUrl));
    }

    return [generateImageUrl(filenames, baseUrl)];
};

const deleteImage = async (filename) => {
    try {
        const filePath = path.join(uploadPath, filename);
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(`Dosya silme hatası: ${error.message}`);
    }
};

const handleUploadErrors = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Dosya boyutu çok büyük! Maksimum 10MB allowed.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Çok fazla dosya! Maksimum 20 dosya yükleyebilirsiniz.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Beklenmeyen dosya alanı!'
            });
        }
    }

    if (error.message.includes('Sadece resim dosyaları')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    if (error.message.includes('Resim işleme hatası')) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

    next(error);
};

export {
    singleImageUpload,
    multipleImageUpload,
    generateImageUrl,
    generateImageUrls,
    deleteImage,
    handleUploadErrors
}; 