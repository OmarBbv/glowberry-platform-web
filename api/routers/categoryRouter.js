import express from 'express';
import categoryController from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', categoryController.getAllCategory);
router.get('/:id', categoryController.getByIdCategory);

export default router;