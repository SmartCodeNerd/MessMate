// controllers/analyticsController.js
import catchAsync from "../utils/catchAsync.js";
import Coupon from "../models/couponModel.js";
import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";
import dayjs from "dayjs";

export const getAnalytics = catchAsync(async (req, res, next) => {
  const { role, collegeId } = req.user;

  const today = dayjs().startOf("day").toDate();
  const weekAgo = dayjs().subtract(7, "day").toDate();

  let analytics = {};

  // ==========================================================
  // 🧑‍💻 SUPER ADMIN ANALYTICS
  // ==========================================================
  if (role === "Super Admin") {
    const [students, collegeAdmins, messAdmins] = await Promise.all([
      User.countDocuments({ role: "Student" }),
      User.countDocuments({ role: "College Admin" }),
      User.countDocuments({ role: "Mess Admin" }),
    ]);

    const totalCoupons = await Coupon.countDocuments();

    // Payments summary by status
    const totalPayments = await Payment.aggregate([
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Weekly coupon creation trend
    const weeklyBookings = await Coupon.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    analytics = {
      users: { students, collegeAdmins, messAdmins },
      coupons: { totalCoupons },
      payments: totalPayments,
      trends: { weeklyBookings },
    };
  }

  // ==========================================================
  // 🧑‍💼 COLLEGE ADMIN ANALYTICS
  // ==========================================================
  else if (role === "College Admin") {
    const totalStudents = await User.countDocuments({
      role: "Student",
      collegeId,
    });

    const totalCoupons = await Coupon.countDocuments({ collegeId });

    // Payments summary
    const totalPayments = await Payment.aggregate([
      { $match: { collegeId } },
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Weekly bookings for that college
    const weeklyBookings = await Coupon.aggregate([
      { $match: { collegeId, createdAt: { $gte: weekAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    analytics = {
      students: { totalStudents },
      coupons: { totalCoupons },
      payments: totalPayments,
      trends: { weeklyBookings },
    };
  }

  // ==========================================================
  // 👨‍🍳 MESS ADMIN ANALYTICS
  // ==========================================================
  else if (role === "Mess Admin") {
    // For now mess = college level since each college has one mess
    const totalStudents = await User.countDocuments({
      role: "Student",
      collegeId,
    });

    const totalCoupons = await Coupon.countDocuments({ collegeId });

    // Used vs unused coupons (approx. by counting eaten meals)
    const usedCoupons = await Coupon.aggregate([
      { $match: { collegeId } },
      { $unwind: "$meals" },
      {
        $project: {
          breakfast: "$meals.breakfast.status",
          lunch: "$meals.lunch.status",
          dinner: "$meals.dinner.status",
        },
      },
      {
        $group: {
          _id: null,
          usedCount: {
            $sum: {
              $size: {
                $filter: {
                  input: ["$breakfast", "$lunch", "$dinner"],
                  as: "meal",
                  cond: { $eq: ["$$meal", "eaten"] },
                },
              },
            },
          },
        },
      },
    ]);

    analytics = {
      messOverview: {
        totalStudents,
        totalCoupons,
        totalUsedMeals: usedCoupons[0]?.usedCount || 0,
      },
    };
  }

  res.status(200).json({
    status: "success",
    role,
    data: analytics,
  });
});
