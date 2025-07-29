import { sequelize } from "../configs/db.js";
import { DataTypes } from "sequelize";

const ProductPromotionSchema = sequelize.define("ProductPromotion", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    seller_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Sellers",
            key: "id"
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Products",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    type: {
        type: DataTypes.ENUM("featured", "vip", "premium"),
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    payment_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    duration_days: { // vip ve premium için (5, 15, 30 gibi)
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    repeat_count: {  // sadece featured için (3,9,15,30 gibi)
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    timestamps: true,
});


export default ProductPromotionSchema;
