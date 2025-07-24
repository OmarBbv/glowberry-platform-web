import { DataTypes } from 'sequelize'
import { sequelize } from '../configs/db.js'

const UserSchema = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    role: {
        type: DataTypes.ENUM('USER'),
        allowNull: false,
        defaultValue: 'USER'
    },
    name: { type: DataTypes.STRING, allowNull: true },
}, { timestamps: true })

export default UserSchema;