import express from 'express';
import userController from '../controllers/userController.js';
import authenticateMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/:id', userController.getaUser);
router.get('/', userController.getAllUsers);

router.post('/seller-rating', authenticateMiddleware.user, userController.createRating);

router.get('/seller/:id', userController.getSellerRating);

export default router;