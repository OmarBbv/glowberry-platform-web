import express from 'express';
import productPromotionController from '../controllers/productPromotionController.js';
import authenticateMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/',
    authenticateMiddleware.seller,
    productPromotionController.createPromotion)

export default router;