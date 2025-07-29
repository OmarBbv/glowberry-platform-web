import { Op } from "sequelize";
import ProductSchema from "../models/productModel.js";
import ProductPromotionSchema from "../models/productPromotionModel.js";
import asyncHandler from "express-async-handler";

const productPromotionController = {
    createPromotion: asyncHandler(async (req, res) => {
        try {
            const { product_id, type, start_date, end_date, payment_id, duration_days, repeat_count } = req.body;

            if (!product_id || !type || !start_date || !end_date) {
                return res.status(400).json({ message: 'Eksik alanlar var.' });
            }

            const product = await ProductSchema.findByPk(product_id);
            if (!product) {
                return res.status(404).json({ message: "Ürün bulunamadı." });
            }

            const existingPromotion = await ProductPromotionSchema.findOne({
                where: {
                    product_id,
                    type,
                    start_date: { [Op.lte]: new Date(end_date) },
                    end_date: { [Op.gte]: new Date(start_date) },
                },
            });

            if (existingPromotion) {
                return res.status(400).json({ success: false, message: "Bu ürün için zaten aktif bir promosyon mevcut." });
            }

            const promotion = await ProductPromotionSchema.create({
                seller_id: req.seller.id,
                product_id,
                type,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                payment_id: payment_id || null,
                duration_days: duration_days || null,
                repeat_count: repeat_count || null,
            });

            return res.status(201).json({
                success: true,
                message: "Promosyon başarıyla eklendi.",
                data: promotion
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Sunucu hatası." });
        }
    })

}

export default productPromotionController;
