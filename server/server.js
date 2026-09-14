import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();

let isConnected = false;
const initializeApp = async () => {
    if (!isConnected) {
        await connectDB();
        connectCloudinary();
        isConnected = true;
    }
};

app.use(async (req, res, next) => {
    try {
        await initializeApp();
        if (req.method === 'OPTIONS') {
            return next();
        }
        next();
    } catch (err) {
        res.status(500).send("Database connection error");
    }
});

app.post('/api/order/webhook', express.raw({ type: 'application/json' }), stripeWebhooks);

app.use(express.json());
app.use(cookieParser());

app.use(cors({ 
    origin: function (origin, callback) {
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "Origin", "Accept"]
}));

app.get('/', (req, res) => res.send("API is working"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

export default app;
