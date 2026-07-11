import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import * as membershipController from "../controllers/membershipController.js";

const router = Router();

router.get("/", membershipController.list);
router.get("/:id", membershipController.getById);
router.post("/", authMiddleware, roleMiddleware(["ADMIN"]), membershipController.create);
router.patch("/:id", authMiddleware, roleMiddleware(["ADMIN"]), membershipController.update);
router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), membershipController.remove);

export default router;
