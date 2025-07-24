import express from 'express';
import authenticateMiddleware from '../middlewares/authMiddlewares.js';
import sellerController from '../controllers/sellerController.js';
import { multipleImageUpload, handleUploadErrors } from '../middlewares/imageMiddleware.js';

const router = express.Router();

router.post('/create',
    authenticateMiddleware.seller,
    ...multipleImageUpload('images', 20, { quality: 80, maxWidth: 1800, maxHeight: 1800 }),
    handleUploadErrors,
    sellerController.createProduct
);

router.put('/product/:id',
    authenticateMiddleware.seller,
    ...multipleImageUpload('images', 20, { quality: 80, maxWidth: 1800, maxHeight: 1800 }),
    handleUploadErrors,
    sellerController.updateProductById
);

router.delete('/:id', authenticateMiddleware.seller, sellerController.deleteProductById);
router.get('/products', authenticateMiddleware.seller, sellerController.getProductsBySeller);
router.get('/product/:id', authenticateMiddleware.seller, sellerController.getProductBySellerAndId);
router.put('/info', authenticateMiddleware.seller, sellerController.sellerDataUpdate);

export default router;