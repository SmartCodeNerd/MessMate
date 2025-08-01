import express from "express"
const router = express.Router();
import {createUser} from "../controllers/userController.js";

router.post("/create-user",protect,createUser);

export default router;
