// models/couponTradeModel.js
import mongoose from "mongoose";

const couponTradeSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
  date: {
    type: String, // "YYYY-MM-DD"
    required: true,
  },
  meal: {
    type: String,
    enum: ["breakfast", "lunch", "dinner"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["listed", "sold", "cancelled"],
    default: "listed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  soldAt: {
    type: Date,
  },
});

export default mongoose.model("CouponTrade", couponTradeSchema);
