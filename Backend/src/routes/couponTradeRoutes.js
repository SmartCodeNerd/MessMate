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
router.post("/create-trade", protect, isStudent, listCouponForTrade);
router.get("/get-trades", protect, isStudent, getAvailableCouponsForTrade);
router.post("/buy-trade", protect, isStudent, buyCouponFromTrade);
router.get("/get-my-trades", protect, isStudent, getMyCouponListings);
router.get("/get-my-purchases", protect, isStudent, getMyCouponPurchases);
//if a user creates a trade an then cancels it and then again creates a trade another trade document is created....
router.patch("/cancel-trade/:id", protect, isStudent, cancelCouponListing);
router.get("/get-all-trade", protect, isClgAdmin, getAllCouponTrades);

export default router;
