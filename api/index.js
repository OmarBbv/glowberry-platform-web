import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./configs/db.js";
import cookieParser from 'cookie-parser';

import userRouter from './routers/userRouter.js';
import authRouter from './routers/authRouter.js';
import productRouter from './routers/productRouter.js';
import sellerRouter from './routers/sellerRouter.js';
import wishlistRouter from './routers/wishlistRouter.js';
import cartRouter from './routers/cartRouter.js';
import categoryRouter from './routers/categoryRouter.js';
import productCommentRouter from './routers/productCommentRouter.js';
import productPromotionRouter from './routers/productPromotionRouter.js';

import { seedCategories } from "./seeds/categorySeeds.js";
import { setupRelations } from "./configs/relations.js";
import schedulePromotionCleanup from "./utils/promotionCleanup.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const origin = ['http://localhost:3000', 'http://192.168.100.61:3000']

const corsOptions = {
    origin,
    credentials: true
}


app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/sellers', sellerRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/comments', productCommentRouter);
app.use('/api/v1/promotion', productPromotionRouter);

app.use('/uploads', express.static('uploads'));

async function startApp() {
    try {
        await connectDB();
        setupRelations();
        seedCategories();
        schedulePromotionCleanup();

        app.listen(PORT, () => {
            console.log(`✅ Server ${PORT} portunda çalışıyor`);
        });
    } catch (error) {
        console.error('❌ Uygulama başlatma hatası:', error);
        process.exit(1);
    }
}

startApp();