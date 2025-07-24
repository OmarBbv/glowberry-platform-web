import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

const SellerRatingSchema = sequelize.define('SellerRating', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    seller_id: { type: DataTypes.UUID, allowNull: false },
    user_id: { type: DataTypes.UUID, allowNull: false },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        }
    },
    comment: { type: DataTypes.TEXT },
}, { timestamps: true });

export default SellerRatingSchema;
