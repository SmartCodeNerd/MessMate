import express from "express"
import {
  createCollege,
  getColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
} from "../controllers/collegeController.js";
import {protect,isSuperAdmin} from "../customMiddleware/auth.js"


const router = express.Router();

router.post("/create-college",protect,isSuperAdmin,createCollege);
router.get("/get-colleges",protect,isSuperAdmin, getColleges);
router.get("/get-college/:id",protect,isSuperAdmin, getCollegeById);
router.put("/update-college",protect,isSuperAdmin, updateCollege);
router.delete("/delete-college/:id",protect,isSuperAdmin,deleteCollege);

export default router;
