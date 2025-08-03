import asyncHandler from "express-async-handler"
import CategorySchema from "../models/categoryModel.js";

const categoryController = {
    getAllCategory: asyncHandler(async (req, res) => {
        try {
            const categories = await CategorySchema.findAll();
            res.status(200).json(categories);
        } catch (error) {
            throw new Error(error);
        }
    }),

    getByIdCategory: asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            const category = await CategorySchema.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: "Kategori bulunamadı." });
            }

            res.status(200).json(category);
        } catch (error) {
            throw new Error(error);
        }
    }),

}

export default categoryController