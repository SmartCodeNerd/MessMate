import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Coupon from "../models/couponModel.js";
import CouponTrade from "../models/couponTrade.js";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import Payment from "../models/paymentModel.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const listCouponForTrade = catchAsync(async (req, res, next) => {
    const { date, meal, price } = req.body;
    console.log("Hello");
    console.log(req.body);
    if (!date || !meal || !price) {
        return next(new AppError("All fields (date, meal, price) are required", 400));
    }

    // Validate price cap for each meal
    const maxPrices = {
        breakfast: 25,
        lunch: 45,
        dinner: 40,
    };

    if (!maxPrices[meal]) {
        return next(new AppError("Invalid meal type", 400));
    }

    if (price > maxPrices[meal]) {
        return next(
            new AppError(`Price for ${meal} cannot exceed ₹${maxPrices[meal]}`, 400)
        );
    }

    // Check if trade already exists
    const existingTrade = await CouponTrade.findOne({
        sellerId: req.user._id,
        date,
        meal,
        status: "available",
    });

    if (existingTrade) {
        return next(new AppError("You have already listed this coupon for trade", 400));
    }
    console.log("Coming Till Here1");
    const coupon = await Coupon.findOne({
        userId: req.user._id,
        meals: { $elemMatch: { date } },
    });

    if (!coupon) {
        return next(new AppError("No valid coupon found for the given date", 404));
    }

    const todayMeal = coupon.meals.find((m) => m.date === date);
    if (!todayMeal[meal] || todayMeal[meal].selected !== "BOUGHT_MESS") {
        return next(new AppError(`You have not bought ${meal} on this day`, 400));
    }

    if (todayMeal[meal].status === "eaten") {
        return next(new AppError("Meal already eaten", 400));
    }

    const trade = await CouponTrade.create({
        sellerId: req.user._id,
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

const getAvailableCouponsForTrade = catchAsync(async (req, res) => {
    const today = dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD");
    const available = await CouponTrade.find({
        status: "available",
        collegeId: req.user.collegeId,
        date: { $gte: today },
    }).populate("sellerId", "name email");
    console.log(available);
    res.status(200).json({ success: true, data: available });
});

const buyCouponFromTrade = catchAsync(async (req, res, next) => {
    
    const { tradeId,paymentId } = req.body;
    if (!tradeId) return next(new AppError("tradeId is required", 400));

    const trade = await CouponTrade.findById(tradeId);
    if (!trade || trade.status !== "available") {
        return next(new AppError("Trade not available", 400));
    }

    const { date, meal, price, sellerId } = trade;

    const buyerCoupon = await Coupon.findOne({
        userId: req.user._id,
        meals: { $elemMatch: { date } },
    });

    // ❗ Check if user already bought this meal
    if (buyerCoupon) {
        const buyerMeal = buyerCoupon.meals.find((m) => m.date === date);
        if (buyerMeal && buyerMeal[meal]?.selected !== "NOT_BOUGHT") {
            return next(new AppError("You already have this meal", 400));
        }
    }

    // ✅ Update seller's coupon
    const sellerCoupon = await Coupon.findOne({
        userId: sellerId,
        meals: { $elemMatch: { date } },
    });

    const sellerMeal = sellerCoupon.meals.find((m) => m.date === date);
    sellerMeal[meal].selected = "SOLD_P2P";
    sellerMeal[meal].status = "not eaten";
    await sellerCoupon.save();

    // ✅ If buyer has a coupon but not this date/meal
    if (buyerCoupon) {
        let buyerMeal = buyerCoupon.meals.find((m) => m.date === date);

        // If the date doesn't exist, push a new day object
        if (!buyerMeal) {
            const newDay = {
                date,
                breakfast: { selected: "NOT_BOUGHT", status: "not eaten" },
                lunch: { selected: "NOT_BOUGHT", status: "not eaten" },
                dinner: { selected: "NOT_BOUGHT", status: "not eaten" },
            };
            buyerCoupon.meals.push(newDay);
            buyerMeal = newDay; // assign after pushing
        }

        buyerMeal[meal].selected = "BOUGHT_P2P";
        buyerMeal[meal].status = "not eaten";
        await buyerCoupon.save();
    } else {
        // ✅ Buyer doesn't have any coupons for the week
        const formattedMeals = [
            {
                date,
                breakfast: { selected: meal === "breakfast" ? "BOUGHT_P2P" : "NOT_BOUGHT", status: "not eaten" },
                lunch: { selected: meal === "lunch" ? "BOUGHT_P2P" : "NOT_BOUGHT", status: "not eaten" },
                dinner: { selected: meal === "dinner" ? "BOUGHT_P2P" : "NOT_BOUGHT", status: "not eaten" },
            },
        ];
        console.log(paymentId);
        const payment = await Payment.findOne({ razorpayPaymentId: paymentId });
        if (!payment || payment.status != "paid") {
            return next(new AppError("Payment Not Done Successfully", 400));
        }
        console.log(payment);
        await Coupon.create({
            userId: req.user._id,
            collegeId: req.user.collegeId,
            weekStartDate: date,
            weekEndDate: date,
            meals: formattedMeals,
            totalAmount: price,
            paymentStatus: "paid",
            paymentId: payment._id,
        });
    }

    // ✅ Finalize the trade
    trade.buyerId = req.user._id;
    trade.status = "sold";
    trade.soldAt = new Date();
    await trade.save();

    res.status(200).json({
        success: true,
        message: "Coupon bought successfully",
    });
});

const getMyCouponListings = catchAsync(async (req, res) => {
    const listings = await CouponTrade.find({ sellerId: req.user._id }).sort("-createdAt");
    res.status(200).json({ success: true, data: listings });
});

const getMyCouponPurchases = catchAsync(async (req, res) => {
    const purchases = await CouponTrade.find({ buyerId: req.user._id }).sort("-createdAt");
    res.status(200).json({ success: true, data: purchases });
});

const cancelCouponListing = catchAsync(async (req, res, next) => {
    const trade = await CouponTrade.findOne({ _id: req.params.id, sellerId: req.user._id });
    if (!trade) return next(new AppError("Trade not found", 404));
    if (trade.status !== "available") return next(new AppError("Cannot cancel a completed trade", 400));

    trade.status = "cancelled";
    await trade.save();

    res.status(200).json({ success: true, message: "Listing cancelled successfully" });
});

const getAllCouponTrades = catchAsync(async (req, res) => {
    const trades = await CouponTrade.find({ collegeId: req.user.collegeId })
        .populate("sellerId buyerId", "name email")
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
    getAllCouponTrades,
};