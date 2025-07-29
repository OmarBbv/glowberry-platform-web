import CategorySchema from "../models/categoryModel.js";
import ProductSchema from "../models/productModel.js";
import SellerSchema from "../models/sellerModel.js";
import UserSchema from "../models/userModel.js";
import WishListSchema from "../models/wishlistModel.js";
import CartSchema from "../models/cartModel.js";
import SellerRatingSchema from "../models/SellerRatings.js";
import ProductCommentSchema from "../models/productCommentModel.js";
import ProductPromotionSchema from "../models/productPromotionModel.js";

export function setupRelations() {
    // Product & Seller
    ProductSchema.belongsTo(SellerSchema, {
        foreignKey: 'seller_id',
        as: 'seller'
    });
    SellerSchema.hasMany(ProductSchema, {
        foreignKey: 'seller_id',
        as: 'products'
    });

    // Product & Category
    ProductSchema.belongsTo(CategorySchema, {
        foreignKey: 'category_id',
        as: 'Category'
    });
    CategorySchema.hasMany(ProductSchema, {
        foreignKey: 'category_id',
        as: 'products'
    });

    // Category Self Relation
    CategorySchema.belongsTo(CategorySchema, {
        as: 'parent',
        foreignKey: 'parentId'
    });
    CategorySchema.hasMany(CategorySchema, {
        as: 'subcategories',
        foreignKey: 'parentId'
    });

    // Wishlist Relations
    WishListSchema.belongsTo(UserSchema, {
        foreignKey: 'userId',
        as: 'user'
    });

    UserSchema.hasMany(WishListSchema, {
        foreignKey: 'userId',
        as: 'wishlists'
    });

    WishListSchema.belongsTo(ProductSchema, {
        foreignKey: 'productId',
        as: 'product'
    });
    ProductSchema.hasMany(WishListSchema, {
        foreignKey: 'productId',
        as: 'wishlists'
    });

    // Cart Relations
    CartSchema.belongsTo(UserSchema, {
        foreignKey: 'userId',
        as: 'user'
    });
    UserSchema.hasMany(CartSchema, {
        foreignKey: 'userId',
        as: 'carts'
    });

    CartSchema.belongsTo(ProductSchema, {
        foreignKey: 'productId',
        as: 'product'
    });
    ProductSchema.hasMany(CartSchema, {
        foreignKey: 'productId',
        as: 'carts'
    });

    SellerRatingSchema.belongsTo(SellerSchema, {
        foreignKey: 'seller_id',
        as: 'seller'
    });
    SellerSchema.hasMany(SellerRatingSchema, {
        foreignKey: 'seller_id',
        as: 'ratings'
    });

    // SellerRating & User
    SellerRatingSchema.belongsTo(UserSchema, {
        foreignKey: 'user_id',
        as: 'user'
    });
    UserSchema.hasMany(SellerRatingSchema, {
        foreignKey: 'user_id',
        as: 'ratings'
    });


    // ProductComment -> Product
    ProductCommentSchema.belongsTo(ProductSchema, {
        foreignKey: 'product_id',
        as: 'product'
    });
    ProductSchema.hasMany(ProductCommentSchema, {
        foreignKey: 'product_id',
        as: 'comments'
    });

    // ProductComment -> User
    ProductCommentSchema.belongsTo(UserSchema, {
        foreignKey: 'user_id',
        as: 'user'
    });
    UserSchema.hasMany(ProductCommentSchema, {
        foreignKey: 'user_id',
        as: 'comments'
    });


    // Product & ProductPromotion
    ProductSchema.hasMany(ProductPromotionSchema, {
        foreignKey: "product_id",
        as: "promotions",
        onDelete: "CASCADE"
    });

    ProductPromotionSchema.belongsTo(ProductSchema, {
        foreignKey: "product_id",
        as: "product",
    });

    // ProductPromotion -> Seller
    ProductPromotionSchema.belongsTo(SellerSchema, {
        foreignKey: "seller_id",
        as: "seller"
    });
    SellerSchema.hasMany(ProductPromotionSchema, {
        foreignKey: "seller_id",
        as: "promotions"
    });

}
