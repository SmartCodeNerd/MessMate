import Coupon from "../models/couponModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import Payment from "../models/paymentModel.js";

dayjs.extend(utc);
dayjs.extend(timezone);



//Sample Frontend Payload
// {
//   "weekStartDate": "2025-08-05",
//   "weekEndDate": "2025-08-11",
//   "totalAmount": 540,
//   "meals": [
//     {
//       "date": "2025-08-05",
//       "breakfast": true,
//       "lunch": false,
//       "dinner": true
//     },
//     {
//       "date": "2025-08-06",
//       "breakfast": true,
//       "lunch": true,
//       "dinner": false
//     }
//   ]
// }

const buyCouponFromMess = catchAsync(async (req, res, next) => {
    const { weekStartDate, weekEndDate, meals, totalAmount, paymentId } = req.body;
    console.log(req.body);
    if (!weekStartDate || !weekEndDate || !meals || meals.length === 0 || !totalAmount || !paymentId) {
        return next(new AppError("All fields including paymentId are required", 400));
    }

    if (totalAmount < 432) {
        return next(new AppError("Minimum amount for mess coupon should be ₹432", 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError("User Not Found", 400));
    }

    const existing = await Coupon.findOne({
        userId: req.user._id,
        weekStartDate,
        weekEndDate
    });

    if (existing) {
        return next(new AppError("Coupon for this week already exists", 409));
    }

    const formattedMeals = meals.map(day => ({
        date: day.date,
        breakfast: {
            selected: day.breakfast ? 'BOUGHT_MESS' : 'NOT_BOUGHT',
            status: 'not eaten'
        },
        lunch: {
            selected: day.lunch ? 'BOUGHT_MESS' : 'NOT_BOUGHT',
            status: 'not eaten'
        },
        dinner: {
            selected: day.dinner ? 'BOUGHT_MESS' : 'NOT_BOUGHT',
            status: 'not eaten'
        }
    }));
    const payment = await Payment.findOne({ razorpayPaymentId: paymentId });
    if(!payment || payment.status != "paid") {
        return next(new AppError("Payment Not Done Successfully", 400));
    }

    const newCoupon = await Coupon.create({
        userId: req.user._id,
        collegeId: user.collegeId,
        weekStartDate,
        weekEndDate,
        meals: formattedMeals,
        totalAmount,
        paymentId:payment._id,
        paymentStatus: 'paid'
    });

    res.status(201).json({
        success: true,
        message: "Coupon bought successfully",
        data: newCoupon,
    });
});

const getMyCoupons = catchAsync(async (req, res, next) => {
    //console.log("Check");
    const userId = req.user._id;

    const coupons = await Coupon.find({ userId })
        .populate("paymentId")
        .sort({ weekStartDate: -1 })
        .lean();

    res.status(200).json({
        success: true,
        data: coupons || [], // Return empty array if no coupons found
    });
});

const getAllCoupons = catchAsync(async (req, res, next) => {
    const collegeId = req.user.collegeId;

    if (!collegeId) {
        return next(new AppError("College ID not associated with this user", 400));
    }

    const coupons = await Coupon.find({ collegeId })
        .populate("userId", "name email studentId") // populate user info
        .sort({ weekStartDate: -1 });

    res.status(200).json({
        success: true,
        total: coupons.length,
        data: coupons,
    });
});

const validateCoupon = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const { meal } = req.body;

    if (!userId || !meal) {
        return next(new AppError("userId and meal are required", 400));
    }

    const allowedMeals = ["breakfast", "lunch", "dinner"];
    if (!allowedMeals.includes(meal)) {
        return next(new AppError("Invalid meal type", 400));
    }

    // ✅ Get current IST time and date using dayjs
    const now = dayjs().tz("Asia/Kolkata");
    const currentTime = now.format("HH:mm");
    const todayDate = now.format("YYYY-MM-DD");

    const mealTimeFrames = {
        breakfast: { start: "07:00", end: "09:10" },
        lunch: { start: "12:00", end: "14:10" },
        dinner: { start: "19:00", end: "21:10" },
    };

    const { start, end } = mealTimeFrames[meal];

    if (currentTime < start) {
        return next(new AppError("Meal not started yet", 403));
    }

    const isExpired = currentTime > end;

    const coupon = await Coupon.findOne({
        userId,
        meals: { $elemMatch: { date: todayDate } },
    });

    if (!coupon) {
        return next(new AppError("No valid coupon found for today", 404));
    }

    const todayMeal = coupon.meals.find(m => m.date === todayDate);

    if (!todayMeal[meal] || todayMeal[meal].selected === "NOT_BOUGHT") {
        return next(new AppError(`Meal ${meal} not bought`, 403));
    }

    if (todayMeal[meal].status === "eaten") {
        return res.status(200).json({
            success: true,
            message: `Meal already validated as eaten`,
        });
    }

    // ✅ Update status based on whether current time is within meal window
    if (!isExpired) {
        todayMeal[meal].status = "eaten";
        todayMeal[meal].validatedAt = now.toDate(); // keep as Date object for Mongo
    } else {
        todayMeal[meal].status = "not eaten";
    }

    await coupon.save();

    res.status(200).json({
        success: true,
        message: `Meal ${meal} marked as ${todayMeal[meal].status}`,
        validatedFor: {
            user: coupon.userId,
            date: todayDate,
            meal,
            status: todayMeal[meal].status
        }
    });
});


export {
    buyCouponFromMess,
    getMyCoupons,
    getAllCoupons,
    validateCoupon,
};