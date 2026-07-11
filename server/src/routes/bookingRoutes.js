import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import * as bookingController from "../controllers/bookingController.js";

const router = Router();

router.post("/", authMiddleware, bookingController.create);
router.get("/my", authMiddleware, bookingController.myBookings);
router.delete("/:id", authMiddleware, bookingController.remove);

export default router;
