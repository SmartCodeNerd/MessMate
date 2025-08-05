import express from "express";
import {
  createOrder,
  verifyPayment,
  getMyPayments,
} from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isStudent } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, isStudent, createOrder);
router.post("/verify", protect, isStudent, verifyPayment);
router.get("/my-payments", protect, isStudent, getMyPayments);

export default router;
