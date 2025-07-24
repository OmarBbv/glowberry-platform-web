import { sequelize } from "../configs/db.js";
import { DataTypes } from "sequelize";

const CartSchema = sequelize.define("Cart", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Products",
            key: "id",
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    priceAtTime: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    timestamps: true,
});

export default CartSchema;
