import express from "express"
const router = express.Router();
import {
    createSuperAdmin,
    createCollegeAdmin,
    createStudent,
    createMessAdmin
} from "../controllers/userController.js";
import { protect,isSuperAdmin,isClgAdmin,isMessAdmin,isStudent} from "../customMiddleware/auth.js";

router.post("/create-superAdmin", createSuperAdmin);

//joh banda kar rha he woh super admin hona chahiye
router.post( '/create-collegeAdmin', protect, isSuperAdmin, createCollegeAdmin );

//joh banda kar rha he woh clg admin hona chahiye
router.post( '/create-student', protect, isClgAdmin, createStudent );

//joh banda kar rha he woh clg admin hona chahiye
router.post('/create-messAdmin', protect, isClgAdmin, createMessAdmin );

export default router;
