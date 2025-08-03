import asyncHandler from 'express-async-handler';
import ProductSchema from '../models/productModel.js';
import SellerSchema from '../models/sellerModel.js';
import { processModelImages } from '../helpers/imageHelper.js';

const sellerController = {
    createProduct: asyncHandler(async (req, res) => {
        try {
            const {
                title,
                description,
                price,
                discounted_price,
                category_id,
                quantity,
                min_quantity_to_sell,
                procurement,
                specifications
            } = req.body;

            if (!title || !price || !category_id) {
                return res.status(400).json({
                    success: false,
                    message: "Başlık, fiyat ve kategori alanları zorunludur."
                });
            }

            const sellerInfo = req.seller;
            if (!sellerInfo) {
                return res.status(401).json({
                    success: false,
                    message: "Satıcı bilgisi bulunamadı."
                });
            }

            const images = req.files ? req.files.map(file => file.filename) : [];

            let specificationsObj = {};
            if (specifications) {
                try {
                    specificationsObj = JSON.parse(specifications);
                    if (typeof specificationsObj !== 'object' || Array.isArray(specificationsObj)) {
                        return res.status(400).json({
                            success: false,
                            message: "Specifications mutlaka obje olmalı."
                        });
                    }
                } catch (e) {
                    return res.status(400).json({
                        success: false,
                        message: "Specifications geçerli JSON olmalı."
                    });
                }
            }

            const productData = {
                title,
                description,
                price: parseFloat(price),
                discounted_price: discounted_price ? parseFloat(discounted_price) : null,
                category_id: parseInt(category_id),
                seller_id: sellerInfo.id,
                quantity: quantity ? parseInt(quantity) : 0,
                min_quantity_to_sell: min_quantity_to_sell ? parseInt(min_quantity_to_sell) : null,
                procurement,
                companyName: sellerInfo.companyName,
                images: images.length > 0 ? images : null,
                specifications: Object.keys(specificationsObj).length > 0 ? specificationsObj : null
            };

            const newProduct = await ProductSchema.create(productData);

            const productWithUrls = processModelImages(newProduct.toJSON(), ['images']);

            return res.status(201).json({
                success: true,
                message: "Ürün başarıyla oluşturuldu.",
                data: productWithUrls
            });

        } catch (error) {
            console.error("Ürün oluşturulurken hata:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Bir hata oluştu.",
                error: error.message
            });
        }
    }),

    updateProductById: asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            const sellerInfo = req.seller;

            const product = await ProductSchema.findByPk(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Ürün bulunamadı."
                });
            }

            if (product.seller_id !== sellerInfo.id) {
                return res.status(403).json({
                    success: false,
                    message: "Bu ürünü güncellemek için yetkiniz yok. Yalnızca kendi ürünlerinizi güncelleyebilirsiniz."
                });
            }

            const updateData = { ...req.body };

            if (req.files && req.files.length > 0) {
                const newImages = req.files.map(file => file.filename);

                if (req.body.replaceImages === 'true') {
                    updateData.images = newImages;
                } else {
                    const existingImages = product.images || [];
                    updateData.images = [...existingImages, ...newImages];
                }
            }

            if (updateData.specifications) {
                try {
                    updateData.specifications = JSON.parse(updateData.specifications);
                } catch (e) {
                    return res.status(400).json({
                        success: false,
                        message: "Specifications geçerli JSON olmalı."
                    });
                }
            }

            if (updateData.price) updateData.price = parseFloat(updateData.price);
            if (updateData.discounted_price) updateData.discounted_price = parseFloat(updateData.discounted_price);
            if (updateData.category_id) updateData.category_id = parseInt(updateData.category_id);
            if (updateData.quantity) updateData.quantity = parseInt(updateData.quantity);
            if (updateData.min_quantity_to_sell) updateData.min_quantity_to_sell = parseInt(updateData.min_quantity_to_sell);

            const updatedProduct = await product.update(updateData);

            const productWithUrls = processModelImages(updatedProduct.toJSON(), ['images']);

            res.status(200).json({
                success: true,
                message: "Ürün başarıyla güncellendi.",
                data: productWithUrls
            });

        } catch (error) {
            console.error("Error updating product:", error);
            res.status(500).json({
                success: false,
                message: "Ürün güncellenirken bir hata oluştu.",
                error: error.message
            });
        }
    }),

    deleteProductById: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const sellerInfo = req.seller;

        try {
            const product = await ProductSchema.findByPk(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Ürün bulunamadı."
                });
            }

            if (product.seller_id !== sellerInfo.id) {
                return res.status(403).json({
                    success: false,
                    message: "Bu ürünü silmek için yetkiniz yok. Yalnızca kendi ürünlerinizi silebilirsiniz."
                });
            }

            await product.destroy();

            res.status(200).json({
                success: true,
                message: "Ürün başarıyla silindi."
            });
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({
                success: false,
                message: "Ürün silinirken bir hata oluştu.",
                error: error.message
            });
        }
    }),

    sellerDataUpdate: asyncHandler(async (req, res) => {
        const { companyName, phoneNumber, address, isCompleted } = req.body;
        const sellerInfo = req.seller;

        try {
            if (!sellerInfo) {
                return res.status(401).json({ message: "Satıcı bilgisi bulunamadı." });
            }

            const updatedData = {
                companyName: companyName || sellerInfo.companyName,
                email: sellerInfo.email,
                phoneNumber: phoneNumber || sellerInfo.phoneNumber,
                address: address || sellerInfo.address,
                isCompleted: typeof isCompleted === "boolean" ? isCompleted : sellerInfo.isCompleted
            };

            await SellerSchema.update(updatedData, {
                where: { id: sellerInfo.id }
            });

            const updatedSeller = await SellerSchema.findByPk(sellerInfo.id, {
                attributes: ['id', 'companyName', 'email', 'phoneNumber', 'address', 'isCompleted']
            });

            res.status(200).json({
                message: "Satıcı bilgileri başarıyla güncellendi.",
                data: updatedSeller
            });

        } catch (error) {
            console.error("Seller data update error:", error);
            res.status(500).json({
                message: "Satıcı bilgileri güncellenirken bir hata oluştu.",
                error: error.message
            });
        }
    }),

    getProductsBySeller: asyncHandler(async (req, res) => {
        const sellerInfo = req.seller;

        if (!sellerInfo) {
            return res.status(401).json({ message: "Satıcı bilgisi bulunamadı." });
        }

        try {
            const products = await ProductSchema.findAll({
                where: { seller_id: sellerInfo.id },
                order: [['createdAt', 'DESC']]
            });

            if (products.length === 0) {
                return res.status(404).json({ message: "Bu satıcıya ait ürün bulunamadı." });
            }

            const productsWithUrls = products.map(product =>
                processModelImages(product.toJSON(), ['images'])
            );

            res.status(200).json({
                message: "Ürünler başarıyla alındı.",
                data: productsWithUrls
            });
        } catch (error) {
            console.error("Error fetching products by seller:", error);
            res.status(500).json({ message: "Ürünler alınırken bir hata oluştu." });
        }
    }),

    getProductBySellerAndId: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const sellerInfo = req.seller;
        if (!sellerInfo) {
            return res.status(401).json({ message: "Satıcı bilgisi bulunamadı." });
        }
        try {
            const product = await ProductSchema.findOne({
                where: { id, seller_id: sellerInfo.id }
            });

            if (!product) {
                return res.status(404).json({ message: "Bu satıcıya ait ürün bulunamadı." });
            }

            const productWithUrls = processModelImages(product.toJSON(), ['images']);

            res.status(200).json({
                message: "Ürün başarıyla alındı.",
                data: productWithUrls
            });
        } catch (error) {
            console.error("Error fetching product by seller and ID:", error);
            res.status(500).json({ message: "Ürün alınırken bir hata oluştu." });
        }
    })
};

export default sellerController;