import express from 'express';
import productCommentController from '../controllers/productCommentController.js';
import { multiUpload } from '../utils/upload.js';
import authenticateMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/',
    authenticateMiddleware.user,
    multiUpload,
    productCommentController.createComment
);


router.get('/', productCommentController.getAllComment);
router.get('/:id', productCommentController.getProductCommentsById);

export default router;