import mongoose from "mongoose";

const DailyMealSchema = new mongoose.Schema({
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
    },
    breakfast: {
        type: Boolean,
        default: false,
    },
    lunch: {
        type: Boolean,
        default: false,
    },
    dinner: {
        type: Boolean,
        default: false,
    }
    }, { _id: false });

    const CouponSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    weekStartDate: {
        type: String, // YYYY-MM-DD
        required: true,
    },
    weekEndDate: {
        type: String, // YYYY-MM-DD
        required: true,
    },
    meals: {
        type: [DailyMealSchema],
        required: true,
        validate: v => v.length > 0,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 432,
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending', 'failed'],
        default: 'pending',
    },
    }, {
    timestamps: true,
    });

    export default mongoose.model('Coupon', CouponSchema);
