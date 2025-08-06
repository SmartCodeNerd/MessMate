import express from "express";
import {
  createOrder,
  verifyPayment,
  getMyPayments,
} from "../controllers/paymentController.js";
import { protect, isStudent } from "../customMiddleware/auth.js";

const router = express.Router();

router.post("/create-order", protect, isStudent, createOrder);
router.post("/verify", protect, isStudent, verifyPayment);
router.get("/my-payments", protect, isStudent, getMyPayments);

export default router;