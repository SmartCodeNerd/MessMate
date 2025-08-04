import express from "express"
const router = express.Router();
import {
  createSuperAdmin,
  createCollegeAdmin,
  createStudent,
  createMessAdmin,
  updateSuperAdmin,
  deleteSuperAdmin,
  updateCollegeAdmin,
  deleteCollegeAdmin,
  updateMessAdmin,
  deleteMessAdmin,
  updateStudent,
  deleteStudent,
  updateUserDocuments
} from "../controllers/userController.js";
import { orMiddleware } from "../customMiddleware/auth.js";
import { memoryUpload,uploadTo } from "../customMiddleware/gridFS.js";
import { protect,isSuperAdmin,isClgAdmin,isMessAdmin,isStudent} from "../customMiddleware/auth.js";

router.post("/create-superAdmin", createSuperAdmin);

//joh banda kar rha he woh super admin hona chahiye
router.post( '/create-collegeAdmin', protect, isSuperAdmin, createCollegeAdmin );

//joh banda kar rha he woh clg admin hona chahiye
router.post('/create-messAdmin', protect, orMiddleware(isClgAdmin,isSuperAdmin), createMessAdmin );

//joh banda kar rha he woh clg admin hona chahiye
router.post( '/create-student', protect, orMiddleware(isClgAdmin,isSuperAdmin,isMessAdmin), createStudent );

// ✅ Update documents route
router.patch(
  "/update-documents",
  protect,
  memoryUpload.fields([
    { name: "passportPhoto", maxCount: 1 },
    { name: "idCard", maxCount: 1 }
  ]),
  uploadTo(gridfs),
  updateUserDocuments
);

router.patch("/update-superAdmin/:id", protect, isSuperAdmin, updateSuperAdmin);
router.patch("/update-collegeAdmin/:id", protect, orMiddleware(isSuperAdmin), updateCollegeAdmin);
router.patch("/update-messAdmin/:id", protect, orMiddleware(isClgAdmin, isSuperAdmin), updateMessAdmin);
router.patch("/update-student/:id", protect, orMiddleware(isClgAdmin, isSuperAdmin, isMessAdmin), updateStudent);

// ========== Delete Routes ==========
router.delete("/delete-superAdmin/:id", protect, isSuperAdmin, deleteSuperAdmin);
router.delete("/delete-collegeAdmin/:id", protect, orMiddleware(isSuperAdmin), deleteCollegeAdmin);
router.delete("/delete-messAdmin/:id", protect, orMiddleware(isClgAdmin, isSuperAdmin), deleteMessAdmin);
router.delete("/delete-student/:id", protect, orMiddleware(isClgAdmin, isSuperAdmin, isMessAdmin), deleteStudent);


export default router;