import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();

let isConnected = false;
const ensureConnections = async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      await connectCloudinary();
      isConnected = true;
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Database connection failed" });
    }
  }
  next();
};

app.use('/api', ensureConnections);

app.post('/api/order/webhook', express.raw({ type: 'application/json' }), stripeWebhooks);

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4000',
  'https://green-cart-theta-eosin.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
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
app.get('/api/status', (req, res) => res.json({ status: "healthy" }));

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
