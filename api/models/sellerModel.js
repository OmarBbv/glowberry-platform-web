import { DataTypes } from "sequelize";
import { sequelize } from "../configs/db.js";

export const SellerSchema = sequelize.define('Seller', {
    // password: { type: DataTypes.STRING, allowNull: true },
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    phoneNumber: { type: DataTypes.STRING, allowNull: false, validate: { len: [10, 15] } },
    companyName: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true, unique: true, validate: { isEmail: true } },
    address: { type: DataTypes.STRING, allowNull: true },
    isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    role: {
        type: DataTypes.ENUM('SELLER'),
        allowNull: false,
        defaultValue: 'SELLER'
    },
}, { timestamps: true })

export default SellerSchema;