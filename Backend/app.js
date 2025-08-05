import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from "./src/routes/userRoutes.js";
import collegeRoutes from "./src/routes/collegeRoutes.js";
import couponRoutes from "./src/routes/couponRoutes.js"
import couponTradeRoutes from "./src/routes/couponTradeRoutes.js";

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

app.listen(port,() => {
    console.log(`Server is Listening to Port-${port}`);
});



