import cron from "node-cron";
import { Op } from "sequelize";
import ProductPromotionSchema from "../models/productPromotionModel.js";

const schedulePromotionCleanup = () => {
    cron.schedule("0 0 * * *", async () => {
        try {
            const now = new Date();
            const expiredPromotions = await ProductPromotionSchema.findAll({
                where: {
                    end_date: {
                        [Op.lt]: now,
                    },
                },
            });

            for (const promo of expiredPromotions) {
                await promo.destroy(); // veya update yapabilirsin
            }

            console.log(`${expiredPromotions.length} adet promosyon süresi doldu ve temizlendi.`);
        } catch (err) {
            console.error("Cron job error:", err);
        }
    });
};

export default schedulePromotionCleanup;
