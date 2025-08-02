import express from 'express'
const router = express.Router()

import { signUpSuperAdmin, registerCollegeAdmin, registerStudent, registerMessAdmin, login, 
    changePassword, completeFirstLogin } from '../controllers/auth.controller.js';

import { protect, authorize } from "../middlewares/auth.js"

// Routes for Login, Register, and Authentication
// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************
router.post('/login', login);
router.post("/signup", signUpSuperAdmin);

//joh banda kar rha he woh super admin hona chahiye
router.post( '/register-college-admin', protect, authorize('SuperAdmin'), registerCollegeAdmin );

//joh banda kar rha he woh clg admin hona chahiye
router.post( '/register-student', protect, authorize('CollegeAdmin'), registerStudent );

//joh banda kar rha he woh clg admin hona chahiye
router.post('/register-mess-admin', protect, authorize('CollegeAdmin'), registerMessAdmin );

//pw change sirf login users hi kar sakte he
router.put( '/change-password', protect, changePassword );

// router.post( '/complete-first-login', protect, completeFirstLogin );
export default router;
