import express from 'express';
import productController from '../controllers/productController.js';
import authenticateMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/similar', productController.getSimilarProducts);
router.get('/:id/similar-by-seller', productController.getSimilarProductsBySeller);

export default router;