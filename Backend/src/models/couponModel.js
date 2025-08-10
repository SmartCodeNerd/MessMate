import mongoose from "mongoose";

const MealStatusSchema = new mongoose.Schema({
    selected: {
        type: String,
        enum: ['NOT_BOUGHT', 'BOUGHT_MESS', 'BOUGHT_P2P', 'SOLD_P2P'],
        default: 'NOT_BOUGHT',
    },
    status: {
        type: String,
        enum: ['eaten', 'not eaten'],
        default: 'not eaten',
    },
    validatedAt: {
        type: Date,
        default: null,
    }
}, { _id: false });

const DailyMealSchema = new mongoose.Schema({
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
    },
    breakfast: {
        type: MealStatusSchema,
        default: () => ({}) // Default to a new MealStatus object
    },
    lunch: {
        type: MealStatusSchema,
        default: () => ({})
    },
    dinner: {
        type: MealStatusSchema,
        default: () => ({})
    }
}, { _id: false });

const CouponSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
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
        required: true
    },  
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
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
