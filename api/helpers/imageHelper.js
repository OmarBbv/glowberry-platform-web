import dotenv from 'dotenv';
import { generateImageUrl, generateImageUrls } from '../middlewares/imageMiddleware.js';

dotenv.config();

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
        return img;
    }
    if (img.startsWith('/uploads/')) {
        return `${baseUrl}${img}`;
    }

    if (baseUrl && baseUrl.endsWith('/uploads')) {
        return `${baseUrl}/${img}`;
    }

    return `${baseUrl}/uploads/${img}`;
}

export const createImageUrl = (filename, baseUrl = process.env.BASE_URL) => {
    return generateImageUrl(filename, baseUrl);
};

export const createImageUrls = (filenames, baseUrl = process.env.BASE_URL) => {
    return generateImageUrls(filenames, baseUrl);
};

export const processModelImages = (model, imageFields = ['image', 'images'], baseUrl = process.env.BASE_URL) => {
    if (!model) return model;

    if (Array.isArray(model)) {
        return model.map(item => processModelImages(item, imageFields, baseUrl));
    }

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

export const processSequelizeImages = (instance, imageFields = ['image', 'images'], baseUrl = process.env.BASE_URL) => {
    if (!instance) return instance;

    const data = instance.dataValues || instance;

    return processModelImages(data, imageFields, baseUrl);
};
