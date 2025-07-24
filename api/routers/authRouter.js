import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/end-otp/user', authController.sendOtpToUser);
router.post('/verify-otp/user', authController.verifyOtp);
router.post('/end-otp/seller', authController.sendOtpToSeller);
router.post('/verify-otp/seller', authController.verifyOtpSeller);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
