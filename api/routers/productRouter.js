import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

// Arama ve öneriler (önce spesifik route'lar)
router.get('/search', productController.getSearchProduct);
router.get('/suggestions', productController.getSearchSuggestions);

// Ürün detayları ve benzer ürünler
router.get('/:id/similar', productController.getSimilarProducts);
router.get('/:id/similar-by-seller', productController.getSimilarProductsBySeller);
router.get('/:id', productController.getProductById);

// Tüm ürünler (en sonda)
router.get('/', productController.getAllProducts);

export default router;