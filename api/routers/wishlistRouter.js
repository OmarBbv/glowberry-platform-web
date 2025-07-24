import express from 'express';
import wishlistController from '../controllers/wishlistController.js';
import authenticateMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/add-or-remove/:id', authenticateMiddleware.user, wishlistController.toggleWishlist);
router.get('/', authenticateMiddleware.user, wishlistController.getAllWishlistItems);
router.delete('/', authenticateMiddleware.user, wishlistController.deleteAllWishlist);

export default router;