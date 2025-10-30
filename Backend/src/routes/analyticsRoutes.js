import express from 'express'
const router = express.Router()

import { getAnalytics } from "../controllers/analyticsController.js";
import { protect,isSuperAdmin,isMessAdmin,isClgAdmin, orMiddleware} from "../customMiddleware/auth.js"

router.get(
  "/",
  protect,
  orMiddleware(isMessAdmin,isClgAdmin,isSuperAdmin),
  getAnalytics
);


export default router;
