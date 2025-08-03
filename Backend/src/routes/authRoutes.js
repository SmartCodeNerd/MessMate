import express from 'express'
const router = express.Router()

import {login,changePassword, completeFirstLogin } from '../controllers/authController.js';

import { protect,isStudent,isSuperAdmin,isMessAdmin,isClgAdmin} from "../customMiddleware/auth.js"

router.post('/login', login);
router.put( '/change-password', protect, changePassword );

// router.post( '/complete-first-login', protect, completeFirstLogin );
export default router;
