import mongoose from "mongoose";
import "dotenv/config";

const mongourl = process.env.MONGODB_URL || false;

if (!mongourl) {
    console.error("MongoDB URL not provided. Set MONGO_URL in environment variables.");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(mongourl);
        console.log("MongoDB Connected!");
    } catch (err) {
        console.error(" MongoDB Connection Error:", err);
        process.exit(1);
    }
};

export default connectDB;