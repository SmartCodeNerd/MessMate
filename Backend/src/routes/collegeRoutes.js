import express from "express"
import {
  createCollege,
  getColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
} from "../controllers/collegeController.js";
import {protect,isClgAdmin,isMessAdmin,isStudent,is} from "../customMiddleware/auth.js"


const router = express.Router();

router.post("/",protect,isSuperAdmin,createCollege);
router.get("/",protect,isSuperAdmin, getColleges);
router.get("/:id",protect,isSuperAdmin, getCollegeById);
router.put("/:id",protect,isSuperAdmin, updateCollege);
router.delete("/:id",protect,isSuperAdmin,deleteCollege);

export default router;
