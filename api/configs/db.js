import { Sequelize } from "sequelize";

const sequelize = new Sequelize("GlowBerry", "postgres", "metroboomin2425", {
    host: "localhost",
    dialect: "postgres",
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ PostgreSQL bağlantısı başarılı!");

        await sequelize.sync({ alter: true });
        // await sequelize.sync({ force: true });

        console.log("✅ Veritabanı tabloları oluşturuldu veya güncellendi");
        return sequelize;
    } catch (error) {
        console.error("❌ Veritabanı bağlantı hatası:", error);
        throw error;
    }
};

export { sequelize, connectDB };
