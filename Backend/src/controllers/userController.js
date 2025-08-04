import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import sendEmail from "../utils/emailService.js";
import College from "../models/collegeModel.js";
import crypto from "crypto";

const generateRandomPassword = () => {
    return crypto.randomBytes(5).toString('hex'); // 10-char hex password
};

//While Creating Super Admin, Password is needed.
const createSuperAdmin = catchAsync(async (req, res, next) => {
    const { name, email, password, contactNumber } = req.body;

    if (!name || !email || !password || !contactNumber) {
        return next(new AppError("Name, Email, Password, and Confirm Password fields are required.", 403));
    }

    let user = await User.findOne({ email });
    if (user) {
        return next(new AppError("User with this email already exists.", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user = new User({
        name,
        email,
        password: hashedPassword,
        role: 'Super Admin',
        contactNumber,
        isFirstLogin: false,
    });

    await user.save();

    const emailSubject = 'Your Super Admin Account Credentials';
    const emailText = `Hello ${name},\n\nYour account has been created.\n\nEmail: ${email}\nPassword: ${password}\n\nThank you,\nSuperadmin`;

    await sendEmail({ to: email, subject: emailSubject, text: emailText });

    res.status(201).json({
        success: true,
        message: `Super admin ${name} registered successfully. Credentials sent to ${email}.`
    });
});

//And when super admin creates other roles,their password is sent to them over mail.
const createCollegeAdmin = catchAsync(async (req, res, next) => {
    const { name, email, collegeId, contactNumber } = req.body;

    let user = await User.findOne({ email });
    if (user) {
        return next(new AppError("User with this email already exists.", 400));
    }
    let college = await College.findById(collegeId);
    if(!college) {
        return next(new AppError("No College Found"));
    }

    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    user = new User({
        name,
        email,
        password: hashedPassword,
        role: 'College Admin',
        collegeId,
        isFirstLogin: true,
        contactNumber,
    });

    await user.save();

    const emailSubject = 'Your College Admin Account Credentials';
    const emailText = `Hello ${name},\n\nYour account has been created.\n\nEmail: ${email}\nPassword: ${randomPassword}\n\nPlease log in and change your password.\n\nThank you,\nSuperadmin`;

    await sendEmail({ to: email, subject: emailSubject, text: emailText });

    res.status(201).json({
        success: true,
        message: `College admin ${name} registered successfully. Credentials sent to ${email}.`
    });
});

const createStudent = catchAsync(async (req, res, next) => {
    const { name, email, studentId, contactNumber } = req.body;
    const collegeId = req.user.collegeId;

    if (!name || !email || !studentId) {
        return next(new AppError("Name, email, and student ID are required.", 400));
    }

    let user = await User.findOne({ email });
    if (user) {
        return next(new AppError("User with this email already exists.", 400));
    }

    let existingStudent = await User.findOne({ collegeId, studentId });
    if (existingStudent) {
        return next(new AppError(`A student with ID ${studentId} already exists in this college.`, 400));
    }

    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    user = new User({
        name,
        email,
        password: hashedPassword,
        role: 'Student',
        collegeId,
        studentId,
        isFirstLogin: true,
        contactNumber,
    });

    await user.save({ validateBeforeSave: false });

    const emailSubject = 'Your Student Account Credentials';
    const emailText = `Hello ${name},\n\nYour student account has been created.\n\nEmail: ${email}\nPassword: ${randomPassword}\n\nPlease log in to continue.`;

    await sendEmail({ to: email, subject: emailSubject, text: emailText });

    res.status(201).json({
        success: true,
        message: `Student ${name} registered successfully. Credentials sent to ${email}.`
    });
});

const createMessAdmin = catchAsync(async (req, res, next) => {
    const { name, email ,contactNumber} = req.body;
    const collegeId = req.user.collegeId;

    let user = await User.findOne({ email });
    if (user) {
        return next(new AppError("User with this email already exists.", 400));
    }

    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    user = new User({
        name,
        email,
        password: hashedPassword,
        role: 'Mess Admin',
        collegeId,
        isFirstLogin: true,
        contactNumber
    });

    await user.save();

    const emailSubject = 'Your Mess Admin Account Credentials';
    const emailText = `Hello ${name},\n\nYour mess admin account has been created.\n\nEmail: ${email}\nPassword: ${randomPassword}\n\nPlease log in to continue.`;

    await sendEmail({ to: email, subject: emailSubject, text: emailText });

    res.status(201).json({
        success: true,
        message: `Mess Admin ${name} registered successfully. Credentials sent to ${email}.`
    });
});

export {
    createSuperAdmin,
    createCollegeAdmin,
    createStudent,
    createMessAdmin,
};