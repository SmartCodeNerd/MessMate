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
    if (!college) {
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
    const { name, email, contactNumber } = req.body;
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

const updateUserById = (role) => catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return next(new AppError("User not found", 404));
    if (user.role !== role) return next(new AppError(`User is not a ${role}`, 400));

    const allowedFields = ["name", "email", "contactNumber"];
    if (role === "Student") allowedFields.push("studentId");

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    await user.save();

    res.status(200).json({
        success: true,
        message: `${role} updated successfully.`,
        user,
    });
});

const updateUserDocuments = catchAsync(async (req, res, next) => {
    const { userId } = req.body;

    if (!userId || !req.file) {
        return next(new AppError("User ID and file are required", 400));
    }

    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    user.passportPhoto = {
        fileName: req.file.filename,
        fileUrl: '/files/${req.file.filename}',
        contentType: req.file.mimetype,
        uploadedAt: new Date(),
    };

    await user.save();

    res.status(200).json({
        success: true,
        message: "Passport photo updated successfully.",
        data: user.passportPhoto,
    });
});

// ✅ Delete User by Role
const deleteUserById = (role) => catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findOneAndDelete({ _id: id, role });
    if (!user) return next(new AppError(`${role} not found`, 404));

    res.status(200).json({
        success: true,
        message: `${role} deleted successfully.`,
    });
});

// ✅ Export CRUD for each role
const updateSuperAdmin = updateUserById("Super Admin");
const deleteSuperAdmin = deleteUserById("Super Admin");

const updateCollegeAdmin = updateUserById("College Admin");
const deleteCollegeAdmin = deleteUserById("College Admin");

const updateMessAdmin = updateUserById("Mess Admin");
const deleteMessAdmin = deleteUserById("Mess Admin");

const updateStudent = updateUserById("Student");
const deleteStudent = deleteUserById("Student");

const getAllStudents = catchAsync(async (req, res, next) => {
    const collegeId = req.user.collegeId;

    const college = await College.findById(collegeId);
    if (!college) {
        return next(new AppError("College Not Found", 404));
    }

    const students = await User.find({ collegeId, role: "Student" })
        .select("_id name email studentId contactNumber");

    if (students.length === 0) {
        return next(new AppError("No Students Registered For this College", 400));
    }

    res.status(200).json({
        success: true,
        message: `Students under ${college.name} fetched successfully.`,
        data: students,
    });
});


export {
    createSuperAdmin,
    createCollegeAdmin,
    createStudent,
    createMessAdmin,
    updateUserDocuments,
    updateSuperAdmin,
    deleteSuperAdmin,
    updateCollegeAdmin,
    deleteCollegeAdmin,
    updateMessAdmin,
    deleteMessAdmin,
    updateStudent,
    deleteStudent,
    getAllStudents
};