import College from "../models/collegeModel.js"
import MessAdminProfile from "../models/messAdminProfile.js"
import StudentProfile from "../models/studentProfileModel.js"
import User from "../models/userModel.js"
import "dotenv/config"; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/emailService.js';

const generateRandomPassword = () => {
    return crypto.randomBytes(5).toString('hex');
};


/**
 * @desc    Register a new College Admin (Superadmin only)
 * @route   POST /api/auth/register-college-admin
 * @access  Private (Superadmin)
 */

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

/**
 * @desc    Register a new Student or Mess Admin (College Admin only)
 * @route   POST /api/auth/register-user
 * @access  Private (CollegeAdmin)
 */

exports.registerStudentOrMessAdmin = async (req, res, next) => {
    // This route should be protected by an isCollegeAdmin middleware
    // The logged-in user's info (especially collegeId) will be in req.user from the token

    const { name, email, role } = req.body;
    const collegeId = req.user.collegeId; // Assumes middleware adds user to req

    if (role !== 'Student' && role !== 'MessAdmin') {
        return res.status(400).json({ success: false, message: 'Invalid role specified. Must be "Student" or "Mess Admin".' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 12);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            collegeId, // Assign the college of the creating admin
            isFirstLogin: true,
        });

        await user.save();

        const emailSubject = 'Your Account Credentials';
        const emailText = `Hello ${name},\n\nYour account has been created for the Mess Coupon System.\n\nRole: ${role}\nEmail: ${email}\nPassword: ${randomPassword}\n\nPlease log in and change your password.`;

        await sendEmail({ to: email, subject: emailSubject, text: emailText });

        res.status(201).json({
            success: true,
            message: `${role} "${name}" registered successfully. Credentials sent to ${email}.`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Login user and return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

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
        user.password = undefined;

        res.status(200).json({
            success: true,
            token,
            user, // Send user details (including isFirstLogin flag) to the frontend
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * @desc    Change user password
 * @route   PUT /api/auth/change-password
 * @access  Private (Logged-in users)
 */
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

/**
 * @desc    Allows user to dismiss the "first login" prompt without changing password
 * @route   POST /api/auth/complete-first-login
 * @access  Private (Logged-in users)
 */
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


