import { formatImageUrls } from '../helpers/imageHelper.js';
import ProductSchema from '../models/productModel.js';
import WishListSchema from '../models/wishlistModel.js';
import asyncHandler from 'express-async-handler';

const wishlistController = {
    toggleWishlist: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const userId = req.user.id;

        try {
            const product = await ProductSchema.findByPk(id);

            if (!product) {
                return res.status(400).json({ message: 'Məhsul tapılmadı' });
            }

            const existingWish = await WishListSchema.findOne({
                where: {
                    productId: id,
                    userId: userId
                }
            });

            if (existingWish) {
                await existingWish.destroy();
                return res.status(200).json({ message: 'Məhsul seçilənlərdən çıxarıldı.' });
            }

            const newWishProduct = await WishListSchema.create({
                productId: id,
                userId: userId
            });

            res.status(200).json({
                message: 'Məhsul seçilənlərə əlavə edildi.',
                data: newWishProduct
            });

        } catch (error) {
            console.error('Problem yaşandı', error);
            res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
                message: error.message || "Məhsul seçilənlərə əlavə olunarkən bir xəta baş verdi."
            });
        }
    }),

    getAllWishlistItems: asyncHandler(async (req, res) => {
        const userId = req.user.id;

        try {
            const wishlistItems = await WishListSchema.findAll({
                where: { userId },
                include: [{ model: ProductSchema, as: 'product' }]
            });

            if (wishlistItems.length === 0) {
                return res.status(200).json({
                    message: 'Seçilənlər siyahısı boşdur.',
                    data: []
                });
            }

            const formattedWishlist = wishlistItems.map(item => {
                const product = item.product?.toJSON?.() || item.product;

                if (product && product.images) {
                    product.images = formatImageUrls(product.images);
                }

                return {
                    ...item.toJSON(),
                    product
                };
            });

            res.status(200).json({
                message: 'Seçilənlər siyahısı alındı.',
                data: formattedWishlist
            });
        } catch (error) {
            console.error('Xəta baş verdi:', error);
            res.status(500).json({ message: 'Seçilənlər siyahısı alınarkən xəta baş verdi.' });
        }
    }),

    deleteAllWishlist: asyncHandler(async (req, res) => {
        try {
            const userId = req.user.id;

            await WishListSchema.destroy({
                where: { userId }
            });

            res.status(200).json({
                message: 'Seçilənlər siyahısı təmizləndi.',
                data: []
            });
        } catch (error) {
            console.error('Xəta baş verdi:', error);
            res.status(500).json({
                message: 'Seçilənlər siyahısını təmizləyərkən xəta baş verdi.'
            });
        }
    })
}

export default wishlistController;