import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    
  amount: {
    type: Number,
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created",
  },
  purpose: {
    type: String, // e.g. "Mess Coupon"
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Payment", paymentSchema);
