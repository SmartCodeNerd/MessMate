import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from "./src/routes/userRoutes.js";
import collegeRoutes from "./src/routes/collegeRoutes.js";
import couponRoutes from "./src/routes/couponRoutes.js"
import couponTradeRoutes from "./src/routes/couponTradeRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import globalErrorHandler from "./src/utils/globalErrorHandler.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 8000;

connectDB();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use('/api/auth', authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/college",collegeRoutes);
app.use("/api/coupon",couponRoutes);
app.use("/api/couponTrade",couponTradeRoutes);
app.use("/api/payment",paymentRoutes);

app.use(globalErrorHandler);

app.listen(port,() => {
    console.log(`Server is Listening to Port-${port}`);
});



