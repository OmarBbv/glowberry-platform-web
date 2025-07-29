import jwt from 'jsonwebtoken';
import SellerSchema from '../models/sellerModel.js';
import UserSchema from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'secret_grow';

const authenticateMiddleware = {
    user: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Token tapılmadı və ya düzgün deyil.' });
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, SECRET_KEY);

            if (!decoded?.id) {
                return res.status(401).json({ message: 'Token məlumatları natamamdır.' });
            }

            const user = await UserSchema.findOne({ where: { id: decoded.id } });
            if (!user) {
                return res.status(401).json({ message: 'İstifadəçi mövcud deyil və ya token köhnədir.' });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token etibarsızdır.' });
        }
    },

    seller: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Token tapılmadı və ya düzgün deyil.' });
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, SECRET_KEY);

            if (!decoded?.id) {
                return res.status(401).json({ message: 'Token məlumatları natamamdır.' });
            }

            const seller = await SellerSchema.findOne({ where: { id: decoded.id } });
            if (!seller) {
                return res.status(401).json({ message: 'Satıcı mövcud deyil və ya token köhnədir.' });
            }

            req.seller = seller;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token etibarsızdır.' });
        }
    },
};

export default authenticateMiddleware;
