import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

const ProductCommentSchema = sequelize.define('ProductComment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        validate: {
            max: 5,
            min: 1
        },
        allowNull: true
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true
    },
}, { timestamps: true });

export default ProductCommentSchema