import Razorpay from "razorpay";
import crypto from "crypto";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Payment from "../models/paymentModel.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = catchAsync(async (req, res, next) => {
  const { amount, purpose } = req.body;

  if (!amount || !purpose) {
    return next(new AppError("Amount and purpose are required", 400));
  }

  const options = {
    amount: amount * 100, // Convert to paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  await Payment.create({
    userId: req.user._id,
    amount,
    razorpayOrderId: order.id,
    purpose,
  });

  res.status(201).json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
});

const verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const body = razorpayOrderId + "|" + razorpayPaymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    return next(new AppError("Invalid payment signature", 400));
  }

  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId },
    {
      razorpayPaymentId,
      razorpaySignature,
      status: "paid",
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    data: payment,
  });
});

const getMyPayments = catchAsync(async (req, res, next) => {
  const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: payments,
  });
});

export {
  createOrder,
  verifyPayment,
  getMyPayments
};
