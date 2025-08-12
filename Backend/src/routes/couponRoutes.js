import express from "express";
import { protect, isStudent, isClgAdmin,isMessAdmin,isSuperAdmin, orMiddleware } from "../customMiddleware/auth.js";
import {
    buyCouponFromMess,
    getMyCoupons,
    getAllCoupons,
    validateCoupon,
    checkAvailable
} from "../controllers/couponController.js";

const router = express.Router();

router.post("/buy-coupon", protect, isStudent, buyCouponFromMess);
router.get("/get-my-coupon",protect,isStudent,getMyCoupons);
router.get("/get-all-coupons",protect,orMiddleware(isClgAdmin,isMessAdmin),getAllCoupons);
router.post("/check-available",protect,isStudent,checkAvailable);
router.post("/validate-coupon", protect, orMiddleware(isStudent,isMessAdmin,isClgAdmin), validateCoupon);

export default router;

