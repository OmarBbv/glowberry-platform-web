import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

router.get('/search', productController.getSearchProduct);
router.get('/suggestions', productController.getSearchSuggestions);

router.get('/:id/similar', productController.getSimilarProducts);
router.get('/:id/similar-by-seller', productController.getSimilarProductsBySeller);
router.get('/:id', productController.getProductById);

router.get('/', productController.getAllProducts);

export default router;