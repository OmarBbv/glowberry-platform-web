import asyncHandler from 'express-async-handler';
import UserSchema from '../models/userModel.js';
import SellerSchema from '../models/sellerModel.js';
import { generateRefreshToken, generateToken } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';

const otpStore = new Map();

export const authController = {
    sendOtpToUser: asyncHandler(async (req, res) => {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ message: 'Telefon numarası gerekli.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        console.log('otp', otp);

        otpStore.set(phoneNumber, otp);
        setTimeout(() => otpStore.delete(phoneNumber), 5 * 60 * 1000);

        res.status(200).json({ message: 'OTP gönderildi.' });
    }),

    verifyOtp: asyncHandler(async (req, res) => {
        const { phoneNumber, otp } = req.body;

        const storedOtp = otpStore.get(phoneNumber);
        if (!storedOtp) return res.status(400).json({ message: 'OTP süresi dolmuş.' });
        if (parseInt(otp) !== storedOtp) return res.status(400).json({ message: 'Yanlış OTP.' });

        let user = await UserSchema.findOne({ where: { phoneNumber } });
        if (!user) user = await UserSchema.create({ phoneNumber });

        otpStore.delete(phoneNumber);

        const payload = { phoneNumber, id: user.id };
        const accessToken = generateToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 gün
        });

        res.status(200).json({
            message: 'Doğrulama başarılı!',
            token: accessToken,
            user: {
                id: user.id,
                phoneNumber: user.phoneNumber,
                role: user.role
            }
        });
    }),

    sendOtpToSeller: asyncHandler(async (req, res) => {
        const { phoneNumber } = req.body;

        if (!phoneNumber) return res.status(400).json({ message: 'Telefon numarası gerekli.' });

        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log('otp', otp);

        otpStore.set(phoneNumber, otp);
        setTimeout(() => otpStore.delete(phoneNumber), 5 * 60 * 1000);

        res.status(200).json({ message: 'OTP gönderildi.' });
    }),

    verifyOtpSeller: asyncHandler(async (req, res) => {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) return res.status(400).json({ message: 'Bilgiler eksik.' });

        const storedOtp = otpStore.get(phoneNumber);
        if (!storedOtp) return res.status(400).json({ message: 'OTP süresi dolmuş.' });
        if (parseInt(otp) !== storedOtp) return res.status(400).json({ message: 'Yanlış OTP.' });

        let seller = await SellerSchema.findOne({ where: { phoneNumber } });

        if (!seller) {
            seller = await SellerSchema.create({ phoneNumber, isCompleted: false });
        }

        otpStore.delete(phoneNumber);

        const payload = { phoneNumber, id: seller.id };
        const accessToken = generateToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Doğrulama başarılı!',
            token: accessToken,
            seller: {
                id: seller.id,
                phoneNumber: seller.phoneNumber,
                isCompleted: seller.isCompleted,
                role: seller.role
            }
        });
    }),

    refreshToken: asyncHandler(async (req, res) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) return res.status(401).json({ message: 'Refresh token yoxdur.' });

        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Refresh token vaxtı keçib.' });

            const { id, phoneNumber } = decoded;
            const newAccessToken = generateToken({ id, phoneNumber });

            res.json({ token: newAccessToken });
        });
    }),

    logout: asyncHandler(async (req, res) => {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({ message: 'Çıkış başarılı!' });
    })
};

export default authController;
