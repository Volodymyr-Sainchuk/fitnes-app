import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware(["ADMIN"]), userController.listUsers);
router.post("/", authMiddleware, roleMiddleware(["ADMIN"]), userController.createUser);
router.get("/me", authMiddleware, userController.getMe);
router.patch("/me", authMiddleware, userController.updateMe);
router.patch("/:id", authMiddleware, roleMiddleware(["ADMIN"]), userController.updateUser);
router.patch("/:id/role", authMiddleware, roleMiddleware(["ADMIN"]), userController.updateUserRole);

export default router;
