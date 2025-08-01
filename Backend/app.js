import express from "express";
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./src/config/db.js";

const port = process.env.PORT || 8000;

connectDB();

app.listen(port,() => {
    console.log(`Server is Listening to Port-${port}`);
});



