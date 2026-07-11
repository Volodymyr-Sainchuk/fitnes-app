import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import * as trainerController from "../controllers/trainerController.js";

const router = Router();

router.get("/", trainerController.list);
router.get("/:id", trainerController.getById);
router.post("/", authMiddleware, roleMiddleware(["ADMIN"]), trainerController.create);
router.patch("/:id", authMiddleware, roleMiddleware(["ADMIN"]), trainerController.update);
router.delete("/:id", authMiddleware, roleMiddleware(["ADMIN"]), trainerController.remove);

export default router;
