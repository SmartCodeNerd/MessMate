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
  updateUserDocuments,
  getAllStudents,
  getAllMembers
} from "../controllers/userController.js";
import { orMiddleware } from "../customMiddleware/auth.js";
import { memoryUpload, uploadTo } from "../customMiddleware/gridFS.js";
import { createFeedback } from "../controllers/feedbackController.js";
import { protect, isSuperAdmin, isClgAdmin, isMessAdmin, isStudent } from "../customMiddleware/auth.js";
import { gridfs } from "../customMiddleware/gridFS.js";

router.post("/create-superAdmin", createSuperAdmin);

//joh banda kar rha he woh super admin hona chahiye
router.post('/create-collegeAdmin', protect, isSuperAdmin, createCollegeAdmin);

//joh banda kar rha he woh clg admin hona chahiye
router.post('/create-messAdmin', protect, orMiddleware(isClgAdmin, isSuperAdmin), createMessAdmin);

//joh banda kar rha he woh clg admin hona chahiye
router.post('/create-student', protect, orMiddleware(isClgAdmin, isSuperAdmin, isMessAdmin), createStudent);

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

router.get("/get-all-students", protect, orMiddleware(isClgAdmin, isMessAdmin), getAllStudents);

router.get("/get-all-members", protect, orMiddleware(isClgAdmin,isMessAdmin,isSuperAdmin), getAllMembers);

router.patch("/update-superAdmin/:id", protect, isSuperAdmin, updateSuperAdmin);
router.patch("/update-collegeAdmin/:id", protect, orMiddleware(isSuperAdmin), updateCollegeAdmin);
router.patch("/update-messAdmin/:id", protect, orMiddleware(isClgAdmin, isSuperAdmin), updateMessAdmin);
router.patch("/update-student/:id", protect, orMiddleware(isClgAdmin, isSuperAdmin, isMessAdmin), updateStudent);

// ========== Delete Routes ==========
router.delete("/delete-superAdmin/:id", protect, isSuperAdmin, deleteSuperAdmin);
router.delete("/delete-collegeAdmin/:id", protect, orMiddleware(isSuperAdmin), deleteCollegeAdmin);
router.delete("/delete-messAdmin/:id", protect, orMiddleware(isClgAdmin, isSuperAdmin), deleteMessAdmin);
router.delete("/delete-student/:id", protect, orMiddleware(isClgAdmin, isSuperAdmin, isMessAdmin), deleteStudent);


//============ Feedback Route =========
// router.post(
//     '/submit', 
//     auth, 
//     isStudent, 
//     upload.array('feedbackImages', 5), // This middleware will handle the file uploads
//     createFeedback
// );

router.post(
  "/submit",
  protect,
  isStudent,
  memoryUpload.fields([
    { name: "feedback", maxCount: 5 },
  ]),                           // Step 1: Upload to Memory
  uploadTo(gridfs),             // Step 2: Move from Memory to GridFS
  createFeedback
);

export default router;