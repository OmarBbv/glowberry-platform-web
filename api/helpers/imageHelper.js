import dotenv from 'dotenv';
import { generateImageUrl, generateImageUrls } from '../middlewares/imageMiddleware.js';

dotenv.config();

// Eski fonksiyon (geriye uyumluluk için)
export function formatImageUrls(images, baseUrl = process.env.BASE_URL) {
    if (!images) return images;

    if (Array.isArray(images)) {
        return images.map(img => formatSingleImage(img, baseUrl));
    }

    if (typeof images === 'string') {
        return formatSingleImage(images, baseUrl);
    }

    return images;
}

function formatSingleImage(img, baseUrl) {
    if (img.startsWith('http')) {
        return img; // Zaten tam URL, ekleme
    }
    if (img.startsWith('/uploads/')) {
        return `${baseUrl}${img}`; // Sadece base URL ekle
    }

    // BaseUrl'in sonunda /uploads varsa tekrarlama yapma
    if (baseUrl && baseUrl.endsWith('/uploads')) {
        return `${baseUrl}/${img}`;
    }

    return `${baseUrl}/uploads/${img}`; // Dosya adını /uploads/ ile birleştir
}

// Yeni gelişmiş fonksiyonlar (önerilen)
export const createImageUrl = (filename, baseUrl = process.env.BASE_URL) => {
    return generateImageUrl(filename, baseUrl);
};

export const createImageUrls = (filenames, baseUrl = process.env.BASE_URL) => {
    return generateImageUrls(filenames, baseUrl);
};

// Product veya diğer model'ler için image URL'lerini otomatik format etme
export const processModelImages = (model, imageFields = ['image', 'images'], baseUrl = process.env.BASE_URL) => {
    if (!model) return model;

    // Eğer model bir array ise her birini işle
    if (Array.isArray(model)) {
        return model.map(item => processModelImages(item, imageFields, baseUrl));
    }

    // Tek model için image field'larını işle
    const processedModel = { ...model };

    imageFields.forEach(field => {
        if (processedModel[field]) {
            if (Array.isArray(processedModel[field])) {
                processedModel[field] = createImageUrls(processedModel[field], baseUrl);
            } else {
                processedModel[field] = createImageUrl(processedModel[field], baseUrl);
            }
        }
    });

    return processedModel;
};

// Sequelize model instance'ları için özel fonksiyon
export const processSequelizeImages = (instance, imageFields = ['image', 'images'], baseUrl = process.env.BASE_URL) => {
    if (!instance) return instance;

    // DataValues'u al
    const data = instance.dataValues || instance;

    return processModelImages(data, imageFields, baseUrl);
};
