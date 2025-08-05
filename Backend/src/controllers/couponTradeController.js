// controllers/couponTradeController.js
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Coupon from "../models/couponModel.js";
import CouponTrade from "../models/couponTradeModel.js";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";


dayjs.extend(utc);
dayjs.extend(timezone);


const listCouponForTrade = catchAsync(async (req, res, next) => {
    const { date, meal, price } = req.body;

    if (!date || !meal || !price) {
        return next(new AppError("All fields (date, meal, price) are required", 400));
    }

    const coupon = await Coupon.findOne({
        userId: req.user._id,
        meals: { $elemMatch: { date } },
    });

    if (!coupon) return next(new AppError("No valid coupon found for the given date", 404));

    const todayMeal = coupon.meals.find(m => m.date === date);
    if (!todayMeal[meal] || todayMeal[meal].selected !== "BOUGHT_MESS") {
        return next(new AppError(`You have not bought ${meal} on this day`, 400));
    }

    if (todayMeal[meal].status === "eaten") {
        return next(new AppError("Meal already eaten", 400));
    }

    const trade = await CouponTrade.create({
        seller: req.user._id,
        collegeId: req.user.collegeId,
        date,
        meal,
        price,
        status: "available",
    });

    res.status(201).json({
        success: true,
        message: "Coupon listed for trade",
        data: trade,
    });
});

// GET: Available coupons to buy
const getAvailableCouponsForTrade = catchAsync(async (req, res) => {
    const today = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD");
    const available = await CouponTrade.find({
        status: "available",
        collegeId: req.user.collegeId,
        date: { $gte: today },
    }).populate("seller", "name email");

    res.status(200).json({
        success: true,
        data: available,
    });
});

// POST: Buy a coupon
const buyCouponFromTrade = catchAsync(async (req, res, next) => {
    const { tradeId } = req.body;

    if (!tradeId) return next(new AppError("tradeId is required", 400));

    const trade = await CouponTrade.findById(tradeId);

    if (!trade || trade.status !== "available") {
        return next(new AppError("Trade not available", 400));
    }

    const coupon = await Coupon.findOne({
        userId: req.user._id,
        meals: { $elemMatch: { date: trade.date } },
    });

    if (coupon) {
        const todayMeal = coupon.meals.find(m => m.date === trade.date);
        if (todayMeal && todayMeal[trade.meal]?.selected !== "NOT_BOUGHT") {
            return next(new AppError("You already have this meal", 400));
        }
    }

    const sellerCoupon = await Coupon.findOne({
        userId: trade.seller,
        meals: { $elemMatch: { date: trade.date } },
    });
    const sellerMeal = sellerCoupon.meals.find(m => m.date === trade.date);
    sellerMeal[trade.meal].selected = "SOLD_P2P";
    sellerMeal[trade.meal].status = "not eaten";
    await sellerCoupon.save();

    if (coupon) {
        const buyerMeal = coupon.meals.find(m => m.date === trade.date);
        buyerMeal[trade.meal].selected = "BOUGHT_P2P";
        buyerMeal[trade.meal].status = "not eaten";
        await coupon.save();
    } else {
        const formattedMeals = [{
            date: trade.date,
            breakfast: { selected: trade.meal === "breakfast" ? "BOUGHT_P2P" : "NOT_BOUGHT", status: "not eaten" },
            lunch: { selected: trade.meal === "lunch" ? "BOUGHT_P2P" : "NOT_BOUGHT", status: "not eaten" },
            dinner: { selected: trade.meal === "dinner" ? "BOUGHT_P2P" : "NOT_BOUGHT", status: "not eaten" },
        }];
        await Coupon.create({
            userId: req.user._id,
            collegeId: req.user.collegeId,
            weekStartDate: trade.date,
            weekEndDate: trade.date,
            meals: formattedMeals,
            totalAmount: trade.price,
            paymentStatus: 'paid',
        });
    }

    trade.buyer = req.user._id;
    trade.status = "sold";
    await trade.save();

    res.status(200).json({
        success: true,
        message: "Coupon bought successfully",
    });
});

// GET: Seller listings
const getMyCouponListings = catchAsync(async (req, res) => {
    const listings = await CouponTrade.find({ seller: req.user._id }).sort("-createdAt");
    res.status(200).json({ success: true, data: listings });
});

// GET: Buyer's purchases
const getMyCouponPurchases = catchAsync(async (req, res) => {
    const purchases = await CouponTrade.find({ buyer: req.user._id }).sort("-createdAt");
    res.status(200).json({ success: true, data: purchases });
});

// PATCH: Cancel a listing
const cancelCouponListing = catchAsync(async (req, res, next) => {
    const trade = await CouponTrade.findOne({ _id: req.params.id, seller: req.user._id });
    if (!trade) return next(new AppError("Trade not found", 404));
    if (trade.status !== "available") return next(new AppError("Cannot cancel a completed trade", 400));

    trade.status = "cancelled";
    await trade.save();

    res.status(200).json({ success: true, message: "Listing cancelled successfully" });
});

// GET: All trades (Admin)
const getAllCouponTrades = catchAsync(async (req, res) => {
    const trades = await CouponTrade.find({ collegeId: req.user.collegeId })
        .populate("seller buyer", "name email")
        .sort("-createdAt");
    res.status(200).json({ success: true, data: trades });
});

export {
    listCouponForTrade,
    getAvailableCouponsForTrade,
    buyCouponFromTrade,
    getMyCouponListings,
    getMyCouponPurchases,
    cancelCouponListing,
    getAllCouponTrades
};
