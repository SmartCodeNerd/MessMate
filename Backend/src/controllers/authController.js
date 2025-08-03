import User from "../models/userModel.js";
import "dotenv/config"; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/emailService.js';
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const login = catchAsync(async (req, res, next) => {
    const { email, password, studentId } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError("Invalid credentials", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new AppError("Invalid credentials", 401));
    }

    if (user.role === 'Student' && (!studentId || user.studentId !== studentId)) {
        return next(new AppError("Invalid credentials", 401));
    }

    const payload = {
        user: {
            id: user.id,
            role: user.role,
            collegeId: user.collegeId
        }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
        success: true,
        token,
        user: userObj
    });
});

const changePassword = catchAsync(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return next(new AppError("Incorrect old password", 401));
    }

    if (newPassword.length < 6) {
        return next(new AppError("Password must be at least 6 characters long", 400));
    }

    user.password = await bcrypt.hash(newPassword, 12);
    if (user.isFirstLogin) user.isFirstLogin = false;

    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
});

const completeFirstLogin = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, { isFirstLogin: false });

    res.status(200).json({ success: true, message: 'First login process completed.' });
});

export {
    createSuperAdmin,
    createCollegeAdmin,
    createStudent,
    createMessAdmin,
    login,
    changePassword,
    completeFirstLogin,
};
