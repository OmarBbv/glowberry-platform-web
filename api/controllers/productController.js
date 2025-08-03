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
            const limit = parseInt(req.query.limit) || 12;
            const offset = (page - 1) * limit;

            const search = req.query.search || req.query.title || "";
            const categoryId = req.query.category_id;
            const minPrice = parseFloat(req.query.min_price);
            const maxPrice = parseFloat(req.query.max_price);
            const inStock = req.query.in_stock === 'true';
            const sortBy = req.query.sort_by || 'newest';
            const threshold = parseFloat(req.query.threshold) || 0.6;
            const useFuzzySearch = req.query.fuzzy_search !== 'false';
            const strictMode = req.query.strict_mode === 'true'; // Yeni parametre

            const normalizeText = (text) => {
                if (!text) return "";
                const map = {
                    'ə': 'e', 'ö': 'o', 'ğ': 'g', 'ç': 'c', 'ş': 's', 'ü': 'u', 'ı': 'i', 'İ': 'i',
                    'Ə': 'e', 'Ö': 'o', 'Ğ': 'g', 'Ç': 'c', 'Ş': 's', 'Ü': 'u'
                };
                return text.toLowerCase().replace(/[əöğçşıüƏÖĞÇŞÜİ]/g, char => map[char] || char);
            };

            const buildBaseFilters = () => {
                const conditions = [];

                if (categoryId && !isNaN(categoryId)) {
                    const selectedCategoryId = parseInt(categoryId);
                    conditions.push({ category_id: selectedCategoryId });
                }

                if (!isNaN(minPrice) && minPrice >= 0) {
                    conditions.push(
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
                    conditions.push(
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
                    conditions.push({ quantity: { [Op.gt]: 0 } });
                }

                return conditions.length > 0 ? { [Op.and]: conditions } : {};
            };

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

            const performPrioritySearch = async (searchTerm, baseFilters) => {
                const normalizedSearchTerm = normalizeText(searchTerm);
                let allResults = [];
                let searchMethods = [];

                const exactMatches = await ProductSchema.findAll({
                    where: {
                        [Op.and]: [
                            baseFilters,
                            {
                                [Op.or]: [
                                    Sequelize.literal(`LOWER(title) = LOWER('${searchTerm.replace(/'/g, "''")}')`),
                                    Sequelize.literal(`LOWER("companyName") = LOWER('${searchTerm.replace(/'/g, "''")}')`),
                                    Sequelize.literal(`LOWER(title) = LOWER('${normalizedSearchTerm.replace(/'/g, "''")}')`),
                                    Sequelize.literal(`LOWER("companyName") = LOWER('${normalizedSearchTerm.replace(/'/g, "''")}')`),
                                ]
                            }
                        ]
                    },
                    include: [{
                        model: CategorySchema,
                        as: 'Category',
                        required: false,
                        attributes: ['id', 'name', 'slug']
                    }],
                });

                if (exactMatches.length > 0) {
                    allResults.push({
                        priority: 1,
                        method: 'exact_match',
                        results: exactMatches.map(p => ({ item: p.toJSON(), score: 0 }))
                    });
                    searchMethods.push('exact_match');
                }

                if (!strictMode || exactMatches.length === 0) {
                    const startMatches = await ProductSchema.findAll({
                        where: {
                            [Op.and]: [
                                baseFilters,
                                {
                                    [Op.or]: [
                                        { title: { [Op.iLike]: `${searchTerm}%` } },
                                        { companyName: { [Op.iLike]: `${searchTerm}%` } },
                                        { title: { [Op.iLike]: `${normalizedSearchTerm}%` } },
                                        { companyName: { [Op.iLike]: `${normalizedSearchTerm}%` } },
                                    ]
                                },
                                {
                                    [Op.not]: {
                                        [Op.or]: [
                                            Sequelize.literal(`LOWER(title) = LOWER('${searchTerm.replace(/'/g, "''")}')`),
                                            Sequelize.literal(`LOWER("companyName") = LOWER('${searchTerm.replace(/'/g, "''")}')`),
                                        ]
                                    }
                                }
                            ]
                        },
                        include: [{
                            model: CategorySchema,
                            as: 'Category',
                            required: false,
                            attributes: ['id', 'name', 'slug']
                        }],
                    });

                    if (startMatches.length > 0) {
                        allResults.push({
                            priority: 2,
                            method: 'starts_with',
                            results: startMatches.map(p => ({ item: p.toJSON(), score: 0.1 }))
                        });
                        searchMethods.push('starts_with');
                    }
                }

                if (!strictMode || (exactMatches.length === 0 && allResults.length < 5)) {

                    const excludeIds = allResults.flatMap(r => r.results.map(item => item.item.id));

                    const remainingProducts = await ProductSchema.findAll({
                        where: {
                            [Op.and]: [
                                baseFilters,
                                excludeIds.length > 0 ? { id: { [Op.notIn]: excludeIds } } : {}
                            ]
                        },
                        include: [{
                            model: CategorySchema,
                            as: 'Category',
                            required: false,
                            attributes: ['id', 'name', 'slug']
                        }],
                    });

                    if (remainingProducts.length > 0) {
                        const processedProducts = remainingProducts.map(product => {
                            const productJson = product.toJSON();
                            return {
                                ...productJson,
                                normalizedTitle: normalizeText(productJson.title),
                                normalizedCompanyName: normalizeText(productJson.companyName),
                                normalizedDescription: normalizeText(productJson.description),
                                categoryName: productJson.Category?.name || '',
                                normalizedCategoryName: normalizeText(productJson.Category?.name || '')
                            };
                        });

                        const fuseThreshold = strictMode ? Math.min(threshold, 0.4) : threshold;

                        const fuseOptions = {
                            threshold: fuseThreshold,
                            location: 0,
                            distance: 1000,
                            minMatchCharLength: 2,
                            ignoreLocation: true,
                            useExtendedSearch: true,
                            keys: [
                                {
                                    name: 'title',
                                    weight: 0.5
                                },
                                {
                                    name: 'companyName',
                                    weight: 0.3
                                },
                                {
                                    name: 'normalizedTitle',
                                    weight: 0.15
                                },
                                {
                                    name: 'normalizedCompanyName',
                                    weight: 0.05
                                }
                            ],
                            includeScore: true,
                            includeMatches: true,
                        };

                        const fuse = new Fuse(processedProducts, fuseOptions);

                        let fuseResults = [];

                        const mainSearch = fuse.search(searchTerm.trim());
                        fuseResults.push(...mainSearch);

                        if (normalizedSearchTerm !== searchTerm.toLowerCase()) {
                            const normalizedSearch = fuse.search(normalizedSearchTerm);
                            fuseResults.push(...normalizedSearch);
                        }

                        const uniqueFuseResults = new Map();
                        fuseResults.forEach(result => {
                            const id = result.item.id;
                            if (!uniqueFuseResults.has(id) || uniqueFuseResults.get(id).score > result.score) {
                                uniqueFuseResults.set(id, result);
                            }
                        });

                        const sortedFuseResults = Array.from(uniqueFuseResults.values())
                            .sort((a, b) => a.score - b.score);

                        if (sortedFuseResults.length > 0) {
                            allResults.push({
                                priority: 3,
                                method: 'fuse_smart',
                                results: sortedFuseResults
                            });
                            searchMethods.push('fuse_smart');
                        }
                    }
                }

                if (!strictMode && allResults.flatMap(r => r.results).length < limit) {

                    const excludeIds = allResults.flatMap(r => r.results.map(item => item.item.id));
                    const words = searchTerm.split(/\s+/).filter(w => w.length > 1);

                    if (words.length > 0) {
                        const broadMatches = await ProductSchema.findAll({
                            where: {
                                [Op.and]: [
                                    baseFilters,
                                    excludeIds.length > 0 ? { id: { [Op.notIn]: excludeIds } } : {},
                                    {
                                        [Op.or]: [
                                            { title: { [Op.iLike]: `%${searchTerm}%` } },
                                            { companyName: { [Op.iLike]: `%${searchTerm}%` } },
                                            { description: { [Op.iLike]: `%${searchTerm}%` } },
                                            { '$Category.name$': { [Op.iLike]: `%${searchTerm}%` } },
                                            ...words.map(word => ({
                                                [Op.or]: [
                                                    { title: { [Op.iLike]: `%${word}%` } },
                                                    { companyName: { [Op.iLike]: `%${word}%` } }
                                                ]
                                            }))
                                        ]
                                    }
                                ]
                            },
                            include: [{
                                model: CategorySchema,
                                as: 'Category',
                                required: false,
                                attributes: ['id', 'name', 'slug']
                            }],
                            limit: limit * 2
                        });

                        if (broadMatches.length > 0) {
                            allResults.push({
                                priority: 4,
                                method: 'broad_search',
                                results: broadMatches.map(p => ({ item: p.toJSON(), score: 0.8 }))
                            });
                            searchMethods.push('broad_search');
                        }
                    }
                }

                return { allResults, searchMethods };
            };

            let finalProducts = [];
            let totalCount = 0;
            let searchMethod = 'database';
            let usedMethods = [];

            if (search && search.trim() && useFuzzySearch) {

                const baseFilters = buildBaseFilters();
                const { allResults, searchMethods } = await performPrioritySearch(search.trim(), baseFilters);

                usedMethods = searchMethods;

                let combinedResults = [];

                allResults
                    .sort((a, b) => a.priority - b.priority)
                    .forEach(resultGroup => {
                        combinedResults.push(...resultGroup.results);
                    });

                totalCount = combinedResults.length;

                if (sortBy !== 'relevance') {
                    combinedResults = combinedResults.sort((a, b) => {
                        const itemA = a.item;
                        const itemB = b.item;

                        if (sortBy === 'price_asc' || sortBy === 'price_desc') {
                            const priceA = itemA.discounted_price || itemA.price;
                            const priceB = itemB.discounted_price || itemB.price;
                            return sortBy === 'price_asc' ? priceA - priceB : priceB - priceA;
                        } else if (sortBy === 'popular') {
                            return itemB.views - itemA.views;
                        } else {
                            return new Date(itemB.createdAt) - new Date(itemA.createdAt);
                        }
                    });
                }

                const paginatedResults = combinedResults.slice(offset, offset + limit);

                finalProducts = paginatedResults.map(result => ({
                    ...result.item,
                    images: formatImageUrls(result.item.images),
                    category: result.item.Category || null,
                    searchScore: result.score,
                    searchMatches: result.matches?.map(match => ({
                        field: match.key,
                        matchedText: match.value,
                        indices: match.indices
                    }))
                }));

                searchMethod = 'priority_search';

            } else {

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
                const baseFilters = buildBaseFilters();
                const searchCondition = buildSearchConditions(search);

                const allConditions = [];

                if (Object.keys(baseFilters).length > 0) {
                    allConditions.push(baseFilters);
                }

                if (Object.keys(searchCondition).length > 0) {
                    allConditions.push(searchCondition);
                }

                if (allConditions.length > 0) {
                    whereCondition = allConditions.length === 1 ? allConditions[0] : { [Op.and]: allConditions };
                }

                totalCount = await ProductSchema.count({
                    where: whereCondition,
                    include: search ? [{
                        model: CategorySchema,
                        as: 'Category',
                        required: false
                    }] : []
                });

                let orderCondition;
                if (search && search.trim()) {
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

                finalProducts = productsJson.map(product => {
                    return {
                        ...product,
                        images: formatImageUrls(product.images),
                        category: product.Category || null
                    };
                });

                searchMethod = 'database';
            }

            const filterInfo = {
                search: search || null,
                categoryId: categoryId || null,
                priceRange: {
                    min: !isNaN(minPrice) ? minPrice : null,
                    max: !isNaN(maxPrice) ? maxPrice : null
                },
                inStockOnly: inStock,
                sortBy: sortBy,
                searchMethod: searchMethod,
                usedFuzzySearch: useFuzzySearch && search && search.trim(),
                strictMode: strictMode,
                fuzzyThreshold: threshold,
                searchMethods: usedMethods,
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
                const modeText = strictMode ? 'katı' : 'esnek';
                message = `"${search}" için ${totalCount} ürün bulundu (${modeText} arama ile).`;
            } else if (categoryId) {
                message = `Kategori için ${totalCount} ürün bulundu.`;
            } else if (minPrice || maxPrice || inStock) {
                message = `Filtrelere uygun ${totalCount} ürün bulundu.`;
            }

            res.status(200).json({
                message,
                success: true,
                filters: filterInfo,
                data: finalProducts
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

                if (targetProduct.category_id === product.category_id) score += 40;

                const priceDiff = Math.abs(parseFloat(targetProduct.price) - parseFloat(product.price));
                const priceRatio = priceDiff / parseFloat(product.price);
                if (priceRatio <= 0.1) score += 25;
                else if (priceRatio <= 0.2) score += 20;
                else if (priceRatio <= 0.5) score += 15;
                else if (priceRatio <= 1.0) score += 10;
                else if (priceRatio <= 2.0) score += 5;

                if (targetProduct.companyName === product.companyName) score += 20;

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

                if (targetProduct.views > 100) score += 3;
                else if (targetProduct.views > 50) score += 2;
                else if (targetProduct.views > 10) score += 1;

                return score;
            };

            const sameCategory = await ProductSchema.findAll({
                where: {
                    id: { [Op.ne]: product.id },
                    category_id: product.category_id
                },
                order: [['views', 'DESC']],
                limit: 50
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

            const allCandidates = [...sameCategory, ...otherCategories];
            const scoredProducts = allCandidates.map(candidate => ({
                product: candidate,
                score: calculateSimilarityScore(candidate)
            }));

            const sortedProducts = scoredProducts
                .filter(item => item.score > 0)
                .sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return b.product.views - a.product.views;
                });

            let finalProducts = [...sortedProducts];
            if (finalProducts.length < limit * 2) {
                const needed = limit * 3 - finalProducts.length;
                const usedIds = [product.id, ...finalProducts.map(item => item.product.id)];

                const randomPopular = await ProductSchema.findAll({
                    where: {
                        id: { [Op.notIn]: usedIds }
                    },
                    order: [['views', 'DESC']],
                    limit: needed
                });

                const popularScored = randomPopular.map(popular => ({
                    product: popular,
                    score: 1
                }));

                finalProducts.push(...popularScored);
            }

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

                if (targetProduct.category_id === product.category_id) {
                    score += 50;
                }

                const priceDiff = Math.abs(parseFloat(targetProduct.price) - parseFloat(product.price));
                const priceRatio = priceDiff / parseFloat(product.price);

                if (priceRatio <= 0.15) score += 30;
                else if (priceRatio <= 0.3) score += 25;
                else if (priceRatio <= 0.5) score += 20;
                else if (priceRatio <= 1.0) score += 15;
                else if (priceRatio <= 2.0) score += 10;

                if (product.specifications && targetProduct.specifications) {
                    const prodSpecs = product.specifications;
                    const targetSpecs = targetProduct.specifications;

                    if (prodSpecs.color && targetSpecs.color &&
                        prodSpecs.color.toLowerCase() === targetSpecs.color.toLowerCase()) {
                        score += 8;
                    }

                    if (prodSpecs.type && targetSpecs.type &&
                        prodSpecs.type.toLowerCase() === targetSpecs.type.toLowerCase()) {
                        score += 7;
                    }

                    if (prodSpecs.brandCountry && targetSpecs.brandCountry &&
                        prodSpecs.brandCountry.toLowerCase() === targetSpecs.brandCountry.toLowerCase()) {
                        score += 5;
                    }
                }

                if (targetProduct.views > 100) score += 5;
                else if (targetProduct.views > 50) score += 3;
                else if (targetProduct.views > 20) score += 2;
                else if (targetProduct.views > 5) score += 1;

                return score;
            };

            const sellerProducts = await ProductSchema.findAll({
                where: {
                    seller_id: product.seller_id,
                    id: { [Op.ne]: product.id }
                },
                order: [
                    ['views', 'DESC'],
                    ['createdAt', 'DESC']
                ]
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

            const scoredProducts = sellerProducts.map(sellerProduct => ({
                product: sellerProduct,
                score: calculateSellerSimilarityScore(sellerProduct)
            }));

            const sortedProducts = scoredProducts
                .sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return b.product.views - a.product.views;
                })
                .map(item => item.product);

            const totalProducts = sortedProducts.length;
            const totalPages = Math.ceil(totalProducts / limit);
            const paginatedProducts = sortedProducts.slice(offset, offset + limit);

            const formattedProducts = paginatedProducts.map(product => ({
                ...product.toJSON(),
                images: product.images ? formatImageUrls(product.images) : []
            }));

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
            const {
                q,
                limit = 12,
                page = 1,
                threshold = 0.6
            } = req.query;

            if (!q || q.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: 'Axtarmaq üçün birşeylər yazın.'
                });
            }

            const currentPage = parseInt(page);
            const itemsPerPage = parseInt(limit);
            const offset = (currentPage - 1) * itemsPerPage;

            const normalizeText = (text) => {
                if (!text) return "";
                const turkishMap = {
                    'ə': 'e', 'ö': 'o', 'ğ': 'g', 'ç': 'c', 'ş': 's', 'ü': 'u', 'ı': 'i', 'İ': 'i',
                    'Ə': 'e', 'Ö': 'o', 'Ğ': 'g', 'Ç': 'c', 'Ş': 's', 'Ü': 'u'
                };
                return text.toLowerCase().replace(/[əöğçşıüƏÖĞÇŞÜİ]/g, char => turkishMap[char] || char);
            };

            const normalizedQuery = normalizeText(q.trim());

            const allProducts = await ProductSchema.findAll({
                attributes: ['id', 'title', 'companyName', 'description'],
            });

            const processedProducts = allProducts.map(product => {
                const productJson = product.toJSON();
                return {
                    ...productJson,
                    normalizedTitle: normalizeText(productJson.title),
                    normalizedCompanyName: normalizeText(productJson.companyName),
                    normalizedDescription: normalizeText(productJson.description)
                };
            });

            const fuseOptions = {
                threshold: parseFloat(threshold),
                location: 0,
                distance: 1000,
                minMatchCharLength: 1,
                ignoreLocation: true,
                useExtendedSearch: true,
                keys: [
                    {
                        name: 'title',
                        weight: 0.4
                    },
                    {
                        name: 'companyName',
                        weight: 0.3
                    },
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
                includeScore: true,
                includeMatches: false,
            };

            const fuse = new Fuse(processedProducts, fuseOptions);

            let searchResults = [];

            const mainSearch = fuse.search(q.trim());
            searchResults.push(...mainSearch);

            if (normalizedQuery !== q.trim().toLowerCase()) {
                const normalizedSearch = fuse.search(normalizedQuery);
                searchResults.push(...normalizedSearch);
            }

            const words = q.trim().split(/\s+/);
            if (words.length > 1) {
                words.forEach(word => {
                    if (word.length > 1) {
                        const wordSearch = fuse.search(word);
                        searchResults.push(...wordSearch);
                    }
                });
            }

            if (q.length >= 3) {
                const fuzzyPattern = q.split('').join('.*');
                const fuzzySearch = fuse.search(`'${fuzzyPattern}`);
                searchResults.push(...fuzzySearch);
            }

            const uniqueResults = new Map();

            searchResults.forEach(result => {
                const id = result.item.id;
                if (!uniqueResults.has(id) || uniqueResults.get(id).score > result.score) {
                    uniqueResults.set(id, result);
                }
            });

            const allResults = Array.from(uniqueResults.values())
                .sort((a, b) => a.score - b.score);

            const totalResults = allResults.length;
            const totalPages = Math.ceil(totalResults / itemsPerPage);

            const paginatedResults = allResults.slice(offset, offset + itemsPerPage);

            const formattedResults = paginatedResults.map(result => ({
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

            let finalResults = formattedResults;
            let totalFallbackResults = 0;
            let totalFallbackPages = 0;

            if (allResults.length === 0) {
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

                const totalCount = await ProductSchema.count({
                    where: { [Op.or]: sqlConditions }
                });

                totalFallbackResults = totalCount;
                totalFallbackPages = Math.ceil(totalCount / itemsPerPage);

                const sqlResults = await ProductSchema.findAll({
                    where: { [Op.or]: sqlConditions },
                    attributes: ['id', 'title', 'companyName', 'description'],
                    limit: itemsPerPage,
                    offset: offset
                });

                finalResults = sqlResults.map(product => ({
                    ...product.toJSON(),
                    searchScore: null,
                    matches: null,
                    fallbackSearch: true
                }));
            }

            const usedFallback = allResults.length === 0;
            const currentTotalResults = usedFallback ? totalFallbackResults : totalResults;
            const currentTotalPages = usedFallback ? totalFallbackPages : totalPages;

            res.status(200).json({
                success: true,
                message: finalResults.length > 0
                    ? `"${q}" sorğusu üçün ${currentTotalResults} məhsuldan ${finalResults.length} göstərilir.`
                    : 'Heç bir məhsul tapılmadı. Başqa açar sözlər cəhd edin.',
                data: finalResults,
                pagination: {
                    currentPage: currentPage,
                    itemsPerPage: itemsPerPage,
                    totalResults: currentTotalResults,
                    totalPages: currentTotalPages,
                    hasNextPage: currentPage < currentTotalPages,
                    hasPreviousPage: currentPage > 1,
                    nextPage: currentPage < currentTotalPages ? currentPage + 1 : null,
                    previousPage: currentPage > 1 ? currentPage - 1 : null
                },
                searchInfo: {
                    query: q,
                    normalizedQuery: normalizedQuery,
                    usedFuzzySearch: !usedFallback,
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

            const normalizeText = (text) => {
                if (!text) return "";
                const turkishMap = {
                    'ə': 'e', 'ö': 'o', 'ğ': 'g', 'ç': 'c', 'ş': 's', 'ü': 'u', 'ı': 'i', 'İ': 'i',
                    'Ə': 'e', 'Ö': 'o', 'Ğ': 'g', 'Ç': 'c', 'Ş': 's', 'Ü': 'u'
                };
                return text.toLowerCase().replace(/[əöğçşıüƏÖĞÇŞÜİ]/g, char => turkishMap[char] || char);
            };

            const normalizedQuery = normalizeText(q.trim());

            const products = await ProductSchema.findAll({
                attributes: ['title', 'companyName'],
                limit: 500
            });

            const processedProducts = products.map(product => {
                const productJson = product.toJSON();
                return {
                    ...productJson,
                    normalizedTitle: normalizeText(productJson.title),
                    normalizedCompanyName: normalizeText(productJson.companyName)
                };
            });

            const fuseOptions = {
                threshold: 0.5,
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

            let allSuggestions = [];

            const mainSuggestions = fuse.search(q.trim());
            allSuggestions.push(...mainSuggestions);

            if (normalizedQuery !== q.trim().toLowerCase()) {
                const normalizedSuggestions = fuse.search(normalizedQuery);
                allSuggestions.push(...normalizedSuggestions);
            }

            if (q.length >= 2) {
                const prefixSuggestions = fuse.search(`^${q.trim()}`);
                allSuggestions.push(...prefixSuggestions);
            }

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

            const bestSuggestions = Array.from(uniqueSuggestions.values())
                .sort((a, b) => {
                    if (a.score !== b.score) return a.score - b.score;
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