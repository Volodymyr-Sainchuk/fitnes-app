import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import * as classController from "../controllers/classController.js";

const router = Router();

router.get("/", classController.list);
router.get("/:id", classController.getById);
router.post("/", authMiddleware, roleMiddleware(["ADMIN"]), classController.create);
router.patch("/:id", authMiddleware, roleMiddleware(["ADMIN"]), classController.update);
router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), classController.remove);

export default router;
