import { sequelize } from "../configs/db.js";
import { DataTypes } from "sequelize";

const ProductSchema = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    companyName: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    discounted_price: {
        type: DataTypes.DECIMAL(10, 2),
    },
    seller_id: {
        type: DataTypes.UUID,
        references: {
            model: "Sellers",
            key: "id",
        },
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "Categories",
            key: "id",
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    min_quantity_to_sell: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    procurement: {
        type: DataTypes.STRING(100),
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    specifications: {
        type: DataTypes.JSONB,
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: true,
});

export default ProductSchema