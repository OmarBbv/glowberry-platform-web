import asyncHandler from 'express-async-handler';
import ProductSchema from '../models/productModel.js';
import CategorySchema from '../models/categoryModel.js';
import { formatImageUrls } from '../helpers/imageHelper.js';
import { Op, Sequelize } from "sequelize";
import SellerSchema from '../models/sellerModel.js';
import Fuse from 'fuse.js';

const productController = {
    getAllProducts: asyncHandler(async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const offset = (page - 1) * limit;

            const search = req.query.search || req.query.title || "";
            const categoryId = req.query.category_id;
            const minPrice = parseFloat(req.query.min_price);
            const maxPrice = parseFloat(req.query.max_price);
            const inStock = req.query.in_stock === 'true';
            const sortBy = req.query.sort_by || 'newest';

            const normalizeText = (text) => {
                if (!text) return "";
                const map = {
                    'ə': 'e', 'ö': 'o', 'ğ': 'g', 'ç': 'c', 'ş': 's', 'ü': 'u', 'ı': 'i', 'İ': 'i',
                    'Ə': 'e', 'Ö': 'o', 'Ğ': 'g', 'Ç': 'c', 'Ş': 's', 'Ü': 'u'
                };
                return text.toLowerCase().replace(/[əöğçşıüƏÖĞÇŞÜİ]/g, char => map[char] || char);
            };

            const buildSearchConditions = (searchTerm) => {
                if (!searchTerm) return {};

                const normalizedSearch = normalizeText(searchTerm);
                const searchWords = normalizedSearch.split(/\s+/).filter(word => word.length > 0);

                const basicSearchConditions = [
                    { title: { [Op.iLike]: `%${searchTerm}%` } },
                    { companyName: { [Op.iLike]: `%${searchTerm}%` } },
                    { description: { [Op.iLike]: `%${searchTerm}%` } },
                    { procurement: { [Op.iLike]: `%${searchTerm}%` } },

                    Sequelize.literal(`
                        specifications::text ILIKE '%${searchTerm.replace(/'/g, "''")}%'
                    `),

                    { '$Category.name$': { [Op.iLike]: `%${searchTerm}%` } },
                    { '$Category.slug$': { [Op.iLike]: `%${searchTerm}%` } }
                ];

                if (searchWords.length > 1) {
                    const wordSearchConditions = searchWords.map(word => ({
                        [Op.or]: [
                            { title: { [Op.iLike]: `%${word}%` } },
                            { companyName: { [Op.iLike]: `%${word}%` } },
                            { description: { [Op.iLike]: `%${word}%` } },
                            { '$Category.name$': { [Op.iLike]: `%${word}%` } }
                        ]
                    }));
                    basicSearchConditions.push({ [Op.and]: wordSearchConditions });
                }

                return { [Op.or]: basicSearchConditions };
            };

            let whereCondition = {};
            const searchCondition = buildSearchConditions(search);

            const allConditions = [];

            if (Object.keys(searchCondition).length > 0) {
                allConditions.push(searchCondition);
            }

            if (categoryId && !isNaN(categoryId)) {
                const selectedCategoryId = parseInt(categoryId);

                const childCategories = await CategorySchema.findAll({
                    where: { parentId: selectedCategoryId },
                    attributes: ['id']
                });

                const childCategoryIds = childCategories.map(cat => cat.id);

                const categoryFilter = [selectedCategoryId, ...childCategoryIds];

                allConditions.push({ category_id: { [Op.in]: categoryFilter } });
            }

            // Fiyat aralığı filtresi - kullanıcıya gösterilen fiyatı baz alarak filtrele
            if (!isNaN(minPrice) && minPrice >= 0) {
                allConditions.push(
                    Sequelize.literal(`
                        (CASE 
                            WHEN discounted_price IS NOT NULL AND discounted_price > 0 
                            THEN discounted_price 
                            ELSE price 
                        END) >= ${minPrice}
                    `)
                );
            }

            if (!isNaN(maxPrice) && maxPrice >= 0) {
                allConditions.push(
                    Sequelize.literal(`
                        (CASE 
                            WHEN discounted_price IS NOT NULL AND discounted_price > 0 
                            THEN discounted_price 
                            ELSE price 
                        END) <= ${maxPrice}
                    `)
                );
            }

            if (inStock) {
                allConditions.push({ quantity: { [Op.gt]: 0 } });
            }

            if (allConditions.length > 0) {
                whereCondition = allConditions.length === 1 ? allConditions[0] : { [Op.and]: allConditions };
            }

            const getSortOrder = (sortType) => {
                switch (sortType) {
                    case 'price_asc':
                        return [
                            [Sequelize.literal('COALESCE(discounted_price, price)'), 'ASC'],
                            ['createdAt', 'DESC']
                        ];
                    case 'price_desc':
                        return [
                            [Sequelize.literal('COALESCE(discounted_price, price)'), 'DESC'],
                            ['createdAt', 'DESC']
                        ];
                    case 'popular':
                        return [
                            ['views', 'DESC'],
                            ['createdAt', 'DESC']
                        ];
                    case 'newest':
                    default:
                        return [['createdAt', 'DESC']];
                }
            };

            const totalCount = await ProductSchema.count({
                where: whereCondition,
                include: search ? [{
                    model: CategorySchema,
                    as: 'Category',
                    required: false
                }] : []
            });

            let orderCondition;

            if (search && search.trim()) {
                // Search varken de sortBy parametresini dikkate al
                const baseSortOrder = getSortOrder(sortBy);
                orderCondition = [
                    [Sequelize.literal(`
                        CASE 
                            WHEN LOWER(title) = LOWER('${search.replace(/'/g, "''")}') THEN 1
                            WHEN LOWER(title) LIKE LOWER('%${search.replace(/'/g, "''")}%') THEN 2
                            WHEN LOWER("companyName") LIKE LOWER('%${search.replace(/'/g, "''")}%') THEN 3
                            WHEN LOWER(description) LIKE LOWER('%${search.replace(/'/g, "''")}%') THEN 4
                            ELSE 5
                        END
                    `), 'ASC'],
                    ...baseSortOrder
                ];
            } else {
                orderCondition = getSortOrder(sortBy);
            }

            const products = await ProductSchema.findAll({
                where: whereCondition,
                include: [{
                    model: CategorySchema,
                    as: 'Category',
                    required: false,
                    attributes: ['id', 'name', 'slug']
                }],
                order: orderCondition,
                limit,
                offset,
                distinct: true
            });

            const productsJson = products.map(product => product.toJSON());

            const productsWithFullImageUrls = productsJson.map(product => {
                return {
                    ...product,
                    images: formatImageUrls(product.images),
                    category: product.Category || null
                };
            });

            const filterInfo = {
                search: search || null,
                categoryId: categoryId || null,
                priceRange: {
                    min: !isNaN(minPrice) ? minPrice : null,
                    max: !isNaN(maxPrice) ? maxPrice : null
                },
                inStockOnly: inStock,
                sortBy: sortBy,
                pagination: {
                    currentPage: page,
                    perPage: limit,
                    totalItems: totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    hasNextPage: page < Math.ceil(totalCount / limit),
                    hasPreviousPage: page > 1
                }
            };

            let message = 'Ürünler getirildi.';
            if (search) {
                message = `"${search}" için ${totalCount} ürün bulundu.`;
            } else if (categoryId) {
                message = `Kategori için ${totalCount} ürün bulundu.`;
            } else if (minPrice || maxPrice || inStock) {
                message = `Filtrelere uygun ${totalCount} ürün bulundu.`;
            }

            res.status(200).json({
                message,
                success: true,
                filters: filterInfo,
                data: productsWithFullImageUrls
            });

        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({
                message: "Ürünler alınırken bir hata oluştu.",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }),

    getProductById: asyncHandler(async (req, res) => {
        const { id } = req.params;

        try {
            const product = await ProductSchema.findByPk(id, {
                attributes: {
                    include: [
                        [Sequelize.col('seller.phoneNumber'), 'sellerPhoneNumber']
                    ]
                },
                include: [
                    {
                        model: SellerSchema,
                        as: 'seller',
                        attributes: []
                    }
                ]
            });

            if (!product) {
                return res.status(404).json({ message: "Ürün bulunamadı." });
            }

            product.views += 1;
            await product.save();

            const productWithFullImageUrls = {
                ...product.toJSON(),
                images: product.images ? formatImageUrls(product.images) : [],
            };

            res.status(200).json(productWithFullImageUrls);
        } catch (error) {
            console.error("Error fetching product:", error);
            res.status(500).json({ message: "Ürün alınırken bir hata oluştu." });
        }
    }),

    getSimilarProducts: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const offset = (page - 1) * limit;

        try {
            const product = await ProductSchema.findByPk(id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Ürün bulunamadı."
                });
            }

            const calculateSimilarityScore = (targetProduct) => {
                let score = 0;

                // Kategori benzerliği (40 puan)
                if (targetProduct.category_id === product.category_id) score += 40;

                // Fiyat benzerliği (25 puan)
                const priceDiff = Math.abs(parseFloat(targetProduct.price) - parseFloat(product.price));
                const priceRatio = priceDiff / parseFloat(product.price);
                if (priceRatio <= 0.1) score += 25;
                else if (priceRatio <= 0.2) score += 20;
                else if (priceRatio <= 0.5) score += 15;
                else if (priceRatio <= 1.0) score += 10;
                else if (priceRatio <= 2.0) score += 5;

                // Marka benzerliği (20 puan)
                if (targetProduct.companyName === product.companyName) score += 20;

                // Teknik özellikler (15 puan)
                if (product.specifications && targetProduct.specifications) {
                    const prodSpecs = product.specifications;
                    const targetSpecs = targetProduct.specifications;

                    if (prodSpecs.color && targetSpecs.color &&
                        prodSpecs.color.toLowerCase() === targetSpecs.color.toLowerCase()) {
                        score += 7;
                    }

                    if (prodSpecs.type && targetSpecs.type &&
                        prodSpecs.type.toLowerCase() === targetSpecs.type.toLowerCase()) {
                        score += 5;
                    }

                    if (prodSpecs.brandCountry && targetSpecs.brandCountry &&
                        prodSpecs.brandCountry.toLowerCase() === targetSpecs.brandCountry.toLowerCase()) {
                        score += 3;
                    }
                }

                // Popülerlik bonusu
                if (targetProduct.views > 100) score += 3;
                else if (targetProduct.views > 50) score += 2;
                else if (targetProduct.views > 10) score += 1;

                return score;
            };

            // Aday ürünleri al
            const sameCategory = await ProductSchema.findAll({
                where: {
                    id: { [Op.ne]: product.id },
                    category_id: product.category_id
                },
                order: [['views', 'DESC']],
                limit: 50 // Daha fazla çek, sonra filtrele
            });

            const otherCategories = await ProductSchema.findAll({
                where: {
                    id: { [Op.ne]: product.id },
                    category_id: { [Op.ne]: product.category_id },
                    [Op.or]: [
                        { companyName: product.companyName },
                        {
                            price: {
                                [Op.between]: [
                                    Math.max(0, product.price * 0.7),
                                    product.price * 1.5
                                ]
                            }
                        }
                    ]
                },
                order: [['views', 'DESC']],
                limit: 50
            });

            // Skorlama
            const allCandidates = [...sameCategory, ...otherCategories];
            const scoredProducts = allCandidates.map(candidate => ({
                product: candidate,
                score: calculateSimilarityScore(candidate)
            }));

            // Sıralama
            const sortedProducts = scoredProducts
                .filter(item => item.score > 0)
                .sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return b.product.views - a.product.views;
                });

            // Yetersizse popüler ürünlerle tamamla
            let finalProducts = [...sortedProducts];
            if (finalProducts.length < limit * 2) { // Daha fazla veri için
                const needed = limit * 3 - finalProducts.length;
                const usedIds = [product.id, ...finalProducts.map(item => item.product.id)];

                const randomPopular = await ProductSchema.findAll({
                    where: {
                        id: { [Op.notIn]: usedIds }
                    },
                    order: [['views', 'DESC']],
                    limit: needed
                });

                // Popüler ürünleri de skorla
                const popularScored = randomPopular.map(popular => ({
                    product: popular,
                    score: 1 // Minimum skor
                }));

                finalProducts.push(...popularScored);
            }

            // Pagination uygula
            const totalFound = finalProducts.length;
            const totalPages = Math.ceil(totalFound / limit);
            const pagedProducts = finalProducts
                .slice(offset, offset + limit)
                .map(item => item.product);

            const formattedProducts = pagedProducts.map(product => ({
                ...product.toJSON(),
                images: product.images ? formatImageUrls(product.images) : []
            }));

            res.status(200).json({
                success: true,
                message: "Benzer ürünler başarıyla getirildi.",
                data: formattedProducts,
                productMeta: {
                    algorithm: "multi-criteria-smart-similarity",
                    version: "2.0",
                    totalFound: totalFound,
                    currentPage: page,
                    perPage: limit,
                    totalPages: totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                    criteria: ["category", "price", "brand", "specifications", "popularity"]
                }
            });


        } catch (error) {
            console.error("Benzer ürünler getirilirken hata:", error);

            res.status(500).json({
                success: false,
                message: "Benzer ürünler getirilirken bir hata oluştu.",
                error: "SIMILARITY_ERROR"
            });
        }
    }),

    getSimilarProductsBySeller: asyncHandler(async (req, res) => {
        const { id } = req.params;

        // Pagination parametreleri
        const page = parseInt(req.query.page) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        try {
            const product = await ProductSchema.findByPk(id, {
                include: [{
                    model: SellerSchema,
                    as: 'seller',
                    attributes: ['id', 'companyName']
                }]
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Ürün bulunamadı."
                });
            }

            if (!product.seller_id) {
                return res.status(404).json({
                    success: false,
                    message: "Ürünün satıcı bilgisi bulunamadı."
                });
            }

            const calculateSellerSimilarityScore = (targetProduct) => {
                let score = 0;

                // 1. Aynı kategori (50 puan)
                if (targetProduct.category_id === product.category_id) {
                    score += 50;
                }

                // 2. Benzer fiyat aralığı (30 puan)
                const priceDiff = Math.abs(parseFloat(targetProduct.price) - parseFloat(product.price));
                const priceRatio = priceDiff / parseFloat(product.price);

                if (priceRatio <= 0.15) score += 30;      // %15 fark - tam puan
                else if (priceRatio <= 0.3) score += 25;  // %30 fark
                else if (priceRatio <= 0.5) score += 20;  // %50 fark
                else if (priceRatio <= 1.0) score += 15;  // %100 fark
                else if (priceRatio <= 2.0) score += 10;  // %200 fark

                // 3. Specifications benzerliği (20 puan)
                if (product.specifications && targetProduct.specifications) {
                    const prodSpecs = product.specifications;
                    const targetSpecs = targetProduct.specifications;

                    // Renk eşleşmesi (8 puan)
                    if (prodSpecs.color && targetSpecs.color &&
                        prodSpecs.color.toLowerCase() === targetSpecs.color.toLowerCase()) {
                        score += 8;
                    }

                    // Tip/tür eşleşmesi (7 puan)
                    if (prodSpecs.type && targetSpecs.type &&
                        prodSpecs.type.toLowerCase() === targetSpecs.type.toLowerCase()) {
                        score += 7;
                    }

                    // Marka ülkesi eşleşmesi (5 puan)
                    if (prodSpecs.brandCountry && targetSpecs.brandCountry &&
                        prodSpecs.brandCountry.toLowerCase() === targetSpecs.brandCountry.toLowerCase()) {
                        score += 5;
                    }
                }

                // 4. Popülerlik bonusu (views'e göre ek puan)
                if (targetProduct.views > 100) score += 5;
                else if (targetProduct.views > 50) score += 3;
                else if (targetProduct.views > 20) score += 2;
                else if (targetProduct.views > 5) score += 1;

                return score;
            };

            // 1. ADIM: Aynı satıcının tüm ürünlerini al (mevcut ürün hariç)
            const sellerProducts = await ProductSchema.findAll({
                where: {
                    seller_id: product.seller_id,
                    id: { [Op.ne]: product.id }
                },
                order: [
                    ['views', 'DESC'],
                    ['createdAt', 'DESC']
                ]
                // Tüm ürünleri al, sonra skorlayıp sıralayacağız
            });

            if (sellerProducts.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "Bu satıcının başka ürünü bulunamadı.",
                    data: [],
                    pagination: {
                        page,
                        limit,
                        total: 0,
                        totalPages: 0
                    },
                    seller: {
                        companyName: product.seller?.companyName || product.companyName,
                        totalProducts: 1
                    }
                });
            }

            // 2. ADIM: Ürünleri skorla ve sırala
            const scoredProducts = sellerProducts.map(sellerProduct => ({
                product: sellerProduct,
                score: calculateSellerSimilarityScore(sellerProduct)
            }));

            // 3. ADIM: Skorlara göre sırala (en iyiler ilk sırada)
            const sortedProducts = scoredProducts
                .sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return b.product.views - a.product.views; // Eşit skorlarda popülerliğe bak
                })
                .map(item => item.product);

            // 4. ADIM: Pagination uygula
            const totalProducts = sortedProducts.length;
            const totalPages = Math.ceil(totalProducts / limit);
            const paginatedProducts = sortedProducts.slice(offset, offset + limit);

            // 5. ADIM: Sonuçları formatla
            const formattedProducts = paginatedProducts.map(product => ({
                ...product.toJSON(),
                images: product.images ? formatImageUrls(product.images) : []
            }));

            // 6. ADIM: Satıcının toplam ürün sayısını hesapla
            const totalSellerProducts = await ProductSchema.count({
                where: { seller_id: product.seller_id }
            });

            res.status(200).json({
                success: true,
                message: "Satıcının benzer ürünleri başarıyla getirildi.",
                data: formattedProducts,
                pagination: {
                    page,
                    limit,
                    total: totalProducts,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                seller: {
                    id: product.seller_id,
                    companyName: product.seller?.companyName || product.companyName,
                    totalProducts: totalSellerProducts,
                    currentProduct: {
                        id: product.id,
                        title: product.title
                    }
                },
                meta: {
                    algorithm: "seller-similarity-focused",
                    version: "2.0",
                    totalFound: formattedProducts.length,
                    criteria: ["same-seller", "category", "price", "specifications", "popularity"]
                }
            });

        } catch (error) {
            console.error("Satıcının benzer ürünleri getirilirken hata:", error);

            // FALLBACK: Basit yaklaşım - sadece aynı satıcının popüler ürünleri
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = 15;
                const offset = (page - 1) * limit;

                const fallbackProducts = await ProductSchema.findAll({
                    where: {
                        seller_id: product.seller_id,
                        id: { [Op.ne]: id }
                    },
                    order: [['views', 'DESC']],
                    limit,
                    offset
                });

                const totalFallback = await ProductSchema.count({
                    where: {
                        seller_id: product.seller_id,
                        id: { [Op.ne]: id }
                    }
                });

                const fallbackFormatted = fallbackProducts.map(product => ({
                    ...product.toJSON(),
                    images: product.images ? formatImageUrls(product.images) : []
                }));

                res.status(200).json({
                    success: true,
                    message: "Satıcının ürünleri getirildi (basit algoritma).",
                    data: fallbackFormatted,
                    pagination: {
                        page,
                        limit,
                        total: totalFallback,
                        totalPages: Math.ceil(totalFallback / limit),
                        hasNextPage: page < Math.ceil(totalFallback / limit),
                        hasPrevPage: page > 1
                    },
                    meta: {
                        algorithm: "seller-fallback-popular",
                        version: "1.0"
                    }
                });

            } catch (fallbackError) {
                console.error("Satıcı fallback algoritması da başarısız:", fallbackError);
                res.status(500).json({
                    success: false,
                    message: "Satıcının ürünleri getirilirken bir hata oluştu.",
                    error: "SELLER_PRODUCTS_ERROR"
                });
            }
        }
    }),

    getSearchProduct: asyncHandler(async (req, res) => {
        try {
            const { q, limit = 20, threshold = 0.6 } = req.query;

            if (!q || q.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: 'Axtarmaq üçün birşeylər yazın.'
                });
            }

            // Türkçe karakter normalizasyonu
            const normalizeText = (text) => {
                if (!text) return "";
                const turkishMap = {
                    'ə': 'e', 'ö': 'o', 'ğ': 'g', 'ç': 'c', 'ş': 's', 'ü': 'u', 'ı': 'i', 'İ': 'i',
                    'Ə': 'e', 'Ö': 'o', 'Ğ': 'g', 'Ç': 'c', 'Ş': 's', 'Ü': 'u'
                };
                return text.toLowerCase().replace(/[əöğçşıüƏÖĞÇŞÜİ]/g, char => turkishMap[char] || char);
            };

            // Arama terimini normalize et
            const normalizedQuery = normalizeText(q.trim());

            // Önce tüm ürünleri getir ve normalize et
            const allProducts = await ProductSchema.findAll({
                attributes: ['id', 'title', 'companyName', 'description'],
            });

            // Ürünleri normalize edilmiş versiyonlarıyla birlikte hazırla
            const processedProducts = allProducts.map(product => {
                const productJson = product.toJSON();
                return {
                    ...productJson,
                    normalizedTitle: normalizeText(productJson.title),
                    normalizedCompanyName: normalizeText(productJson.companyName),
                    normalizedDescription: normalizeText(productJson.description)
                };
            });

            // Gelişmiş Fuse.js konfigürasyonu
            const fuseOptions = {
                // Daha toleranslı eşik - "zra" -> "zara" gibi durumlar için
                threshold: parseFloat(threshold),

                // Konum ve mesafe parametrelerini optimize et
                location: 0,
                distance: 1000,

                // Minimum karakter uzunluğu
                minMatchCharLength: 1,

                // Pattern length üzerindeki ceza
                ignoreLocation: true,

                // Fuzzy search parametreleri
                useExtendedSearch: true,

                // Arama alanları - hem orijinal hem normalize edilmiş versiyonlar
                keys: [
                    // Orijinal alanlar (yüksek ağırlık)
                    {
                        name: 'title',
                        weight: 0.4
                    },
                    {
                        name: 'companyName',
                        weight: 0.3
                    },
                    // Normalize edilmiş alanlar (orta ağırlık)
                    {
                        name: 'normalizedTitle',
                        weight: 0.2
                    },
                    {
                        name: 'normalizedCompanyName',
                        weight: 0.08
                    },
                    {
                        name: 'description',
                        weight: 0.015
                    },
                    {
                        name: 'normalizedDescription',
                        weight: 0.005
                    }
                ],

                // Sonuç bilgileri
                includeScore: true,
                includeMatches: true,
            };

            // Fuse instance oluştur
            const fuse = new Fuse(processedProducts, fuseOptions);

            // Çoklu arama stratejisi
            let searchResults = [];

            // 1. Ana arama - orijinal sorgu
            const mainSearch = fuse.search(q.trim());
            searchResults.push(...mainSearch);

            // 2. Normalize edilmiş arama
            if (normalizedQuery !== q.trim().toLowerCase()) {
                const normalizedSearch = fuse.search(normalizedQuery);
                searchResults.push(...normalizedSearch);
            }

            // 3. Kelime bazlı arama (birden fazla kelime varsa)
            const words = q.trim().split(/\s+/);
            if (words.length > 1) {
                words.forEach(word => {
                    if (word.length > 1) {
                        const wordSearch = fuse.search(word);
                        searchResults.push(...wordSearch);
                    }
                });
            }

            // 4. Fuzzy pattern arama (özel karakterler için)
            if (q.length >= 3) {
                // Levenshtein benzeri pattern
                const fuzzyPattern = q.split('').join('.*');
                const fuzzySearch = fuse.search(`'${fuzzyPattern}`);
                searchResults.push(...fuzzySearch);
            }

            // Sonuçları birleştir ve sırala
            const uniqueResults = new Map();

            searchResults.forEach(result => {
                const id = result.item.id;
                if (!uniqueResults.has(id) || uniqueResults.get(id).score > result.score) {
                    uniqueResults.set(id, result);
                }
            });

            // En iyi sonuçları al
            const bestResults = Array.from(uniqueResults.values())
                .sort((a, b) => a.score - b.score) // Düşük skor = daha iyi eşleşme
                .slice(0, parseInt(limit));

            // Sonuçları formatla
            const formattedResults = bestResults.map(result => ({
                id: result.item.id,
                title: result.item.title,
                companyName: result.item.companyName,
                description: result.item.description,
                searchScore: result.score,
                matches: result.matches?.map(match => ({
                    field: match.key,
                    matchedText: match.value,
                    indices: match.indices
                }))
            }));

            // Fallback: Eğer hiç sonuç yoksa, SQL araması yap
            let finalResults = formattedResults;

            if (formattedResults.length === 0) {
                console.log('Fuzzy search sonuç bulamadı, SQL fallback araması yapılıyor...');

                // Daha geniş SQL araması
                const sqlSearchTerms = [
                    q.trim(),
                    normalizedQuery,
                    ...words.filter(w => w.length > 1)
                ];

                const sqlConditions = sqlSearchTerms.flatMap(term => [
                    { title: { [Op.iLike]: `%${term}%` } },
                    { companyName: { [Op.iLike]: `%${term}%` } },
                    { description: { [Op.iLike]: `%${term}%` } }
                ]);

                const sqlResults = await ProductSchema.findAll({
                    where: { [Op.or]: sqlConditions },
                    attributes: ['id', 'title', 'companyName', 'description'],
                    limit: parseInt(limit)
                });

                finalResults = sqlResults.map(product => ({
                    ...product.toJSON(),
                    searchScore: null,
                    matches: null,
                    fallbackSearch: true
                }));
            }

            res.status(200).json({
                success: true,
                message: finalResults.length > 0
                    ? `"${q}" sorğusu üçün ${finalResults.length} məhsul tapıldı.`
                    : 'Heç bir məhsul tapılmadı. Başqa açar sözlər cəhd edin.',
                data: finalResults,
                searchInfo: {
                    query: q,
                    normalizedQuery: normalizedQuery,
                    totalResults: finalResults.length,
                    usedFuzzySearch: !finalResults[0]?.fallbackSearch,
                    threshold: parseFloat(threshold),
                    searchStrategies: [
                        'exact-match',
                        'normalized-search',
                        'word-based-search',
                        'fuzzy-pattern-match'
                    ]
                }
            });

        } catch (error) {
            console.error("Gelişmiş ürün arama hatası:", error);

            res.status(500).json({
                success: false,
                message: 'Server xətası baş verdi. Zəhmət olmasa sonra yenidən cəhd edin.',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }),

    getSearchSuggestions: asyncHandler(async (req, res) => {
        try {
            const { q, limit = 8 } = req.query;

            if (!q || q.trim().length < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Axtarış üçün ən azı 1 hərf yazın.'
                });
            }

            // Türkçe karakter normalizasyonu (aynı fonksiyon)
            const normalizeText = (text) => {
                if (!text) return "";
                const turkishMap = {
                    'ə': 'e', 'ö': 'o', 'ğ': 'g', 'ç': 'c', 'ş': 's', 'ü': 'u', 'ı': 'i', 'İ': 'i',
                    'Ə': 'e', 'Ö': 'o', 'Ğ': 'g', 'Ç': 'c', 'Ş': 's', 'Ü': 'u'
                };
                return text.toLowerCase().replace(/[əöğçşıüƏÖĞÇŞÜİ]/g, char => turkishMap[char] || char);
            };

            const normalizedQuery = normalizeText(q.trim());

            // Daha fazla veri al (öneriler için)
            const products = await ProductSchema.findAll({
                attributes: ['title', 'companyName'],
                limit: 500 // Daha iyi öneriler için daha fazla data
            });

            // Ürünleri normalize et
            const processedProducts = products.map(product => {
                const productJson = product.toJSON();
                return {
                    ...productJson,
                    normalizedTitle: normalizeText(productJson.title),
                    normalizedCompanyName: normalizeText(productJson.companyName)
                };
            });

            // Öneri odaklı Fuse konfigürasyonu
            const fuseOptions = {
                threshold: 0.5, // Öneriler için biraz daha toleranslı
                location: 0,
                distance: 500,
                minMatchCharLength: 1,
                ignoreLocation: true,
                keys: [
                    {
                        name: 'title',
                        weight: 0.6
                    },
                    {
                        name: 'companyName',
                        weight: 0.25
                    },
                    {
                        name: 'normalizedTitle',
                        weight: 0.1
                    },
                    {
                        name: 'normalizedCompanyName',
                        weight: 0.05
                    }
                ],
                includeScore: true
            };

            const fuse = new Fuse(processedProducts, fuseOptions);

            // Çoklu öneri stratejisi
            let allSuggestions = [];

            // 1. Orijinal arama
            const mainSuggestions = fuse.search(q.trim());
            allSuggestions.push(...mainSuggestions);

            // 2. Normalize edilmiş arama
            if (normalizedQuery !== q.trim().toLowerCase()) {
                const normalizedSuggestions = fuse.search(normalizedQuery);
                allSuggestions.push(...normalizedSuggestions);
            }

            // 3. Prefix arama (başlangıç karakterleri)
            if (q.length >= 2) {
                const prefixSuggestions = fuse.search(`^${q.trim()}`);
                allSuggestions.push(...prefixSuggestions);
            }

            // Benzersiz önerileri al ve skorlarına göre sırala
            const uniqueSuggestions = new Map();

            allSuggestions.forEach(result => {
                const suggestion = result.item.title.trim();
                if (suggestion && suggestion.length > 0) {
                    if (!uniqueSuggestions.has(suggestion) || uniqueSuggestions.get(suggestion).score > result.score) {
                        uniqueSuggestions.set(suggestion, {
                            text: suggestion,
                            score: result.score,
                            company: result.item.companyName
                        });
                    }
                }
            });

            // Şirket adlarını da öneriler arasına ekle
            allSuggestions.forEach(result => {
                const companyName = result.item.companyName?.trim();
                if (companyName && companyName.length > 0) {
                    if (!uniqueSuggestions.has(companyName) || uniqueSuggestions.get(companyName).score > result.score) {
                        uniqueSuggestions.set(companyName, {
                            text: companyName,
                            score: result.score,
                            type: 'company'
                        });
                    }
                }
            });

            // En iyi önerileri seç
            const bestSuggestions = Array.from(uniqueSuggestions.values())
                .sort((a, b) => {
                    // Önce skora göre sırala
                    if (a.score !== b.score) return a.score - b.score;
                    // Sonra uzunluğa göre (kısa önce)
                    return a.text.length - b.text.length;
                })
                .slice(0, parseInt(limit))
                .map(suggestion => ({
                    text: suggestion.text,
                    type: suggestion.type || 'product',
                    company: suggestion.company,
                    score: suggestion.score
                }));

            res.status(200).json({
                success: true,
                message: `${bestSuggestions.length} öneri bulundu.`,
                data: bestSuggestions,
                meta: {
                    query: q,
                    normalizedQuery: normalizedQuery,
                    totalSuggestions: bestSuggestions.length,
                    algorithm: 'advanced-fuzzy-suggestions'
                }
            });

        } catch (error) {
            console.error("Gelişmiş öneri getirme hatası:", error);
            res.status(500).json({
                success: false,
                message: 'Öneriler getirilirken server xətası baş verdi.',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    })
}

export default productController;