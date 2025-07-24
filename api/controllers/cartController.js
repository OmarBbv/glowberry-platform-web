import asyncHandler from "express-async-handler";
import CartSchema from "../models/cartModel.js";
import ProductSchema from "../models/productModel.js";

const cartController = {
    createProduct: asyncHandler(async (req, res) => {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        try {
            if (!productId || quantity === undefined) {
                return res.status(400).json({ message: 'Məhsulun ID-si və miqdarı tələb olunur.' });
            }

            const product = await ProductSchema.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Məhsul tapılmadı.' });
            }

            const existingCartItem = await CartSchema.findOne({
                where: { userId, productId }
            });

            if (existingCartItem) {

                if (quantity <= 0) {
                    await existingCartItem.destroy();
                    return res.status(200).json({ message: 'Məhsul səbətdən silindi.' });
                }

                existingCartItem.quantity = quantity;
                await existingCartItem.save();

                return res.status(200).json({
                    message: 'Məhsulun səbətdəki miqdarı yeniləndi.',
                    cartItem: existingCartItem
                });

            } else {

                if (quantity <= 0) {
                    return res.status(400).json({ message: 'Məhsulun miqdarı 0 və ya mənfi ola bilməz.' });
                }

                const newCartItem = await CartSchema.create({
                    userId,
                    productId,
                    quantity,
                    priceAtTime: product.discounted_price || product.price
                });

                return res.status(201).json({
                    message: 'Məhsul səbətə əlavə olundu.',
                    cartItem: newCartItem
                });
            }

        } catch (error) {
            console.error('Səbətə məhsul əlavə olunarkən xəta:', error);
            res.status(500).json({
                message: 'Məhsulu səbətə əlavə edərkən xəta baş verdi.',
                error: error.message || 'Daxili server xətası'
            });
        }
    }),

    deleteProduct: asyncHandler(async (req, res) => {
        const productId = req.params.id;
        const userId = req.user.id;

        try {
            if (!productId) {
                return res.status(400).json({ message: 'Məhsulun ID-si tələb olunur.' });
            }

            const cartItem = await CartSchema.findOne({
                where: { userId, productId }
            });

            if (!cartItem) {
                return res.status(404).json({ message: 'Məhsul səbətdə tapılmadı.' });
            }

            await cartItem.destroy();
            res.status(200).json({ message: 'Məhsul səbətdən silindi.' });

        } catch (error) {
            console.error('Səbətdən məhsul silinərkən xəta:', error);
            res.status(500).json({
                message: 'Məhsulu səbətdən silərkən xəta baş verdi.',
                error: error.message || 'Daxili server xətası'
            });
        }
    })
};

export default cartController;
