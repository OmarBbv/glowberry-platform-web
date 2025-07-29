import asyncHandler from 'express-async-handler';
import ProductSchema from '../models/productModel.js';
import ProductCommentSchema from '../models/productCommentModel.js';
import generateImageUrls from '../utils/generateImageUrls.js';
import UserSchema from '../models/userModel.js';

const productCommentController = {
    createComment: asyncHandler(async (req, res) => {
        try {
            const { product_id, rating, comment } = req.body;
            const user = req.user;

            if (!user) {
                console.warn("⚠️ Kullanıcı bulunamadı");
                return res.status(400).json({
                    success: false,
                    message: 'Sadece Istifadeciler comment yazabilir.'
                });
            }

            const findProduct = await ProductSchema.findOne({ where: { id: product_id } });
            console.log("✅ Ürün bulundu mu:", !!findProduct);

            if (!findProduct) {
                console.warn("❌ Ürün bulunamadı");
                return res.status(404).json({
                    success: false,
                    message: 'Ürün bulunamadı.'
                });
            }

            const files = req.files || [];
            console.log("🖼️ Gelen dosyalar:", files);

            const images = generateImageUrls(files, req);
            console.log("🖼️ Oluşturulan image URL'leri:", images);

            const newProductComment = await ProductCommentSchema.create({
                product_id: findProduct.id,
                user_id: user.id,
                rating,
                comment,
                images,
            });

            console.log("✅ Yorum başarıyla oluşturuldu:", newProductComment);

            res.status(201).json({
                success: true,
                message: 'Yorum paylasildi.',
                data: newProductComment
            });

        } catch (error) {
            console.error("❌ createComment hata:", error);
            res.status(500).json({
                success: false,
                message: 'Bir hata oluştu.',
                error: error.message
            });
        }
    }),

    getAllComment: asyncHandler(async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const allComment = await ProductCommentSchema.findAll({
                limit,
                offset
            });

            const total = await ProductCommentSchema.count();

            return res.status(200).json({
                success: true,
                message: 'Yorumlar getirildi.',
                data: allComment,
                totalCount: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Bir hata oluştu.',
                error: error.message
            });
        }
    }),

    getProductCommentsById: asyncHandler(async (req, res) => {
        try {
            const { id: product_id } = req.params;

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const productComments = await ProductCommentSchema.findAll({
                where: { product_id },
                limit,
                offset,
                include: [
                    {
                        model: UserSchema,
                        as: 'user',
                        attributes: ['id', 'name', 'phoneNumber']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            // Toplam yorum sayısını çek
            const totalComments = await ProductCommentSchema.count({
                where: { product_id }
            });

            // Ortalama puan ve toplam puan sayısını çek
            const ratingsData = await ProductCommentSchema.findAll({
                where: { product_id },
                attributes: [
                    [ProductCommentSchema.sequelize.fn('AVG', ProductCommentSchema.sequelize.col('rating')), 'averageRating'],
                    [ProductCommentSchema.sequelize.fn('COUNT', ProductCommentSchema.sequelize.col('rating')), 'totalRatings']
                ],
                raw: true
            });

            const { averageRating, totalRatings } = ratingsData[0];

            // NaN kontrolü - ortalama puan null ise 0.0 olarak dön
            const average = averageRating === null ? 0 : parseFloat(averageRating);

            return res.status(200).json({
                success: true,
                message: 'Ürüne ait yorumlar getirildi.',
                data: productComments,
                totalCount: totalComments,
                currentPage: page,
                totalPages: Math.ceil(totalComments / limit),
                ratings: {
                    averageRating: average.toFixed(1),
                    totalRatings: parseInt(totalRatings) || 0
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Bir hata oluştu.',
                error: error.message
            });
        }
    }),

    getFindByIdComment: asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            const existingComment = await ProductCommentSchema.findByPk(id);

            if (!existingComment) return res.status(404).json({
                success: false,
                message: 'Bele bir serh movcud deyil',
            })

            return res.status(200).json({
                success: true,
                message: 'Serhler getirildi',
                data: existingComment
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Bir hata oluştu.',
                error: error.message
            })
        }
    }),
};

export default productCommentController;
