import express from 'express';
import cartController from '../controllers/cartController.js';
import authenticateMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/add', authenticateMiddleware.user, cartController.createProduct);
router.delete('/remove/:id', authenticateMiddleware.user, cartController.deleteProduct);

export default router;
