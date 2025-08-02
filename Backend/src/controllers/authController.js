import User from "../models/userModel.js"
import "dotenv/config"; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/emailService.js';

const generateRandomPassword = () => {
    return crypto.randomBytes(5).toString('hex');
};

exports.registerCollegeAdmin = async (req, res, next) => {
    // This route should be protected by an isSuperAdmin middleware
    const { name, email, collegeId } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // Generate random password
        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 12);

        // Create new college admin user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'CollegeAdmin',
            collegeId,
            isFirstLogin: true, // Important for the first login flow
        });

        await user.save();

        // Send credentials to the new admin's email
        const emailSubject = 'Your College Admin Account Credentials';
        const emailText = `Hello ${name},\n\nYour account has been created for the Mess Coupon System.\n\nEmail: ${email}\nPassword: ${randomPassword}\n\nPlease log in and change your password at your earliest convenience.\n\nThank you,\nSuperadmin`;

        await sendEmail({
            to: email,
            subject: emailSubject,
            text: emailText,
        });

        res.status(201).json({
            success: true,
            message: `College admin ${name} registered successfully. Credentials sent to ${email}.`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.registerStudent = async (req, res, next) => {
    // This route should be protected by a CollegeAdmin middleware
    const { name, email, studentId } = req.body;
    const collegeId = req.user.collegeId; // From logged-in CollegeAdmin's token

    // Explicit validation for required fields
    if (!name || !email || !studentId ) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields: name, email, studentId.' });
    }
    try {
        // Check if user with this email already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
        }
        
        // Check if a student with this studentId already exists in the same college
        // NOTE: Your schema should ideally have a compound unique index on {collegeId, studentId}
        let existingStudent = await User.findOne({ collegeId, studentId });
        if (existingStudent) {
            return res.status(400).json({ success: false, message: `A student with ID ${studentId} already exists in this college.` });
        }

        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 12);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'Student', // Set role specifically to Student
            collegeId,
            studentId,
            isFirstLogin: true,
        });

        await user.save({ validateBeforeSave: false }); // Bypass validation for fields the student will add later

        const emailSubject = 'Your Student Account Credentials';
        const emailText = `Hello ${name},\n\nYour student account has been created for the Mess Coupon System.\n\nEmail: ${email}\nPassword: ${randomPassword}\n\nPlease log in to continue.`;

        await sendEmail({ to: email, subject: emailSubject, text: emailText });

        res.status(201).json({
            success: true,
            message: `Student "${name}" registered successfully. Credentials sent to ${email}.`
        });

    } catch (error) {
        console.error(error);
        // Provide more specific error for validation issues
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.registerMessAdmin = async (req, res, next) => {
    // This route should be protected by a CollegeAdmin middleware
    const { name, email } = req.body;
    const collegeId = req.user.collegeId; // From logged-in CollegeAdmin's token

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'A user with this email already exists.' });
        }

        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 12);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'MessAdmin', // Set role specifically to MessAdmin
            collegeId,
            isFirstLogin: true,
        });

        await user.save();

        const emailSubject = 'Your Mess Admin Account Credentials';
        const emailText = `Hello ${name},\n\nYour mess admin account has been created.\n\nEmail: ${email}\nPassword: ${randomPassword}\n\nPlease log in to continue.`;

        await sendEmail({ to: email, subject: emailSubject, text: emailText });

        res.status(201).json({
            success: true,
            message: `Mess Admin "${name}" registered successfully. Credentials sent to ${email}.`
        });

    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.login = async (req, res, next) => {
    const { email, password, studentId } = req.body;

    try {
        const user = await User.findOne({ email })
                            // .select('+password');// if password is set.. select:false

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // If the user is a student, we must also validate the studentId
        if (user.role === 'Student') {
            if (!studentId || user.studentId !== studentId) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        }

        // User is authenticated, create token
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                collegeId: user.collegeId
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d', // Token expires in 7 days
        });
        
        // Don't send password back
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({
            success: true,
            token,
            user: userObj, // Send user details (including isFirstLogin flag) to the frontend
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // From auth middleware

    try {
        const user = await User.findById(userId)
                            // .select('+password');// if password is set.. select:false

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect old password' });
        }
        
        if(newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        
        // If it was their first login, update the flag
        if (user.isFirstLogin) {
            user.isFirstLogin = false;
        }
        
        await user.save();

        res.status(200).json({ success: true, message: 'Password changed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/*Allows user to dismiss the "first login" prompt without changing password*/
exports.completeFirstLogin = async (req, res, next) => {
    const userId = req.user.id;

    try {
        await User.findByIdAndUpdate(userId, { isFirstLogin: false });
        res.status(200).json({ success: true, message: 'First login process completed.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


