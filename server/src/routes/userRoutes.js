import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.get("/me", authMiddleware, userController.getMe);
router.patch("/me", authMiddleware, userController.updateMe);

export default router;
