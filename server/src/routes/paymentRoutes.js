import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as paymentController from "../controllers/paymentController.js";

const router = Router();

router.post("/create-session", authMiddleware, paymentController.createSession);

export default router;
