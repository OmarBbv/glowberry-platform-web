import asyncHandler from 'express-async-handler';
import UserSchema from '../models/userModel.js';
import SellerRatingSchema from '../models/SellerRatings.js';

export const userController = {
    getAllUsers: asyncHandler(async (req, res) => {
        const allUser = await UserSchema.findAll();

        res.status(200).json({
            message: 'Bütün istifadəçilər gətirildi.',
            data: allUser
        })
    }),

    getaUser: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const findUser = await UserSchema.findByPk(id);

        if (!findUser) return res.status(400).json({ message: 'İstifadəçi tapılmadı.' });

        return res.status(200).json({
            message: 'İstifadəçi gətirildi.',
            data: findUser
        })
    }),

    createRating: asyncHandler(async (req, res) => {
        try {
            const { seller_id, rating, comment } = req.body;
            const user = req.user;
            console.log(user);

            if (!user) return res.status(400).json({
                success: false,
                message: "Sadece uyeler yorum yapabilir.",
            })

            if (!seller_id || !rating) return res.status(400).json({
                success: false,
                message: 'satici id ve rating lazimdir.'
            })

            const existingRating = await SellerRatingSchema.findOne({
                where: {
                    seller_id,
                    user_id: user.id
                }
            })

            if (existingRating) {
                return res.status(400).json({
                    success: false,
                    message: "Bu satıcıya zaten puan verdiniz."
                });
            }


            const newRating = await SellerRatingSchema.create({
                seller_id,
                user_id: user.id,
                rating,
                comment
            });

            res.status(201).json({
                success: true,
                message: "Puan başarıyla eklendi.",
                data: newRating
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Sunucu hatası oluştu.',
                error: error.message || error.toString(),
            });
        }
    }),

    getSellerRating: asyncHandler(async (req, res) => {
        try {
            const { seller_id } = req.params;
            if (!seller_id) {
                return res.status(400).json({
                    success: false,
                    message: "Satıcı ID'si gerekli."
                });
            }

            const ratings = await SellerRatingSchema.findAll({
                where: { seller_id }
            });

            res.status(200).json({
                success: true,
                data: ratings
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Puanlar alınırken hata oluştu.',
                error: error.message
            });
        }
    })
}

export default userController;