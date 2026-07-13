import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import * as adminAnalyticsController from "../controllers/adminAnalyticsController.js";

const router = Router();

router.use(authMiddleware, roleMiddleware(["ADMIN"]));

router.get("/overview", adminAnalyticsController.overview);
router.get("/members", adminAnalyticsController.members);
router.get("/memberships", adminAnalyticsController.memberships);
router.get("/revenue", adminAnalyticsController.revenue);
router.get("/bookings", adminAnalyticsController.bookings);

export default router;
