import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/db.js';

function slugify(text) {
    const map = {
        'ə': 'e',
        'ö': 'o',
        'ğ': 'g',
        'ç': 'c',
        'ş': 's',
        'ü': 'u',
        'ı': 'i',
        'İ': 'i',
        'Ə': 'e',
        'Ö': 'o',
        'Ğ': 'g',
        'Ç': 'c',
        'Ş': 's',
        'Ü': 'u',
    };

    return text
        .toString()
        .toLowerCase()
        .replace(/[əöğçşıüƏÖĞÇŞÜİ]/g, char => map[char] || char)
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

const CategorySchema = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Categories',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    tableName: 'Categories',
    underscored: true
});

CategorySchema.addHook('beforeValidate', (category) => {
    if (!category.slug && category.name) {
        category.slug = slugify(category.name);
    }
});

export default CategorySchema;