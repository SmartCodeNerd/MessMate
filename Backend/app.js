import express from "express";
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./src/config/db.js";

const port = process.env.PORT || 8000;

connectDB();

import userRoutes from "./src/routes/userRoutes.js";

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/users",userRoutes)

app.listen(port,() => {
    console.log(`Server is Listening to Port-${port}`);
});



