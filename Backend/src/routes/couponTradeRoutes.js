import express from "express";
import { protect, isStudent, isClgAdmin,isMessAdmin,isSuperAdmin, orMiddleware } from "../customMiddleware/auth.js";
import {
    listCouponForTrade,
    getAvailableCouponsForTrade,
    buyCouponFromTrade,
    getMyCouponListings,
    getMyCouponPurchases,
    cancelCouponListing,
    getAllCouponTrades
} from "../controllers/couponTradeController.js";

const router = express.Router();

//Coupon Trade Routes
router.post("/coupon-trade/list", protect, isStudent, listCouponForTrade);
router.get("/coupon-trade/available", protect, isStudent, getAvailableCouponsForTrade);
router.post("/coupon-trade/buy", protect, isStudent, buyCouponFromTrade);
router.get("/coupon-trade/my-listings", protect, isStudent, getMyCouponListings);
router.get("/coupon-trade/my-purchases", protect, isStudent, getMyCouponPurchases);
router.patch("/coupon-trade/cancel/:id", protect, isStudent, cancelCouponListing);

router.get("/coupon-trade/all", protect, isClgAdmin, getAllCouponTrades);

export default router;