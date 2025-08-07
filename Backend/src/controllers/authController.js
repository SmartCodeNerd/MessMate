import User from "../models/userModel.js";
import "dotenv/config"; 
import jwt from 'jsonwebtoken';
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import bcrypt from 'bcrypt';
import sendEmail from "../utils/emailService.js";

const login = catchAsync(async (req, res, next) => {
    //console.log(req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError("Invalid credentials", 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new AppError("Invalid credentials", 401));
    }

    const payload = {
        user: {
            id: user.id,
            role: user.role,
        }
    };

    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRE) {
        return next(new AppError("JWT secret or expire time is not defined", 500));
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
        success: true,
        user: userObj,
        token,
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

    const emailSubject = `Password Changed Successfully`;
    const emailText = `Hello ${user.name},\n\nYour ${user.role} account password has been changed successfully.\n\nEmail: ${user.email}\nPassword: ${newPassword}\n\nPlease log in to continue.`;

    await sendEmail({ to: user.email, subject: emailSubject, text: emailText });

    res.status(200).json({ success: true, message: 'Password changed successfully' });
});

const completeFirstLogin = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, { isFirstLogin: false });

    res.status(200).json({ success: true, message: 'First login process completed.' });
});

export {
    login,
    changePassword,
    completeFirstLogin,
};
