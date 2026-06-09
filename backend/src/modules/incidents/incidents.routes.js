import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createIncident, listIncidents, updateIncident, deleteIncident } from "./incidents.controller.js";

const router = Router();

router.post("/", authMiddleware, createIncident);
router.get("/", authMiddleware, listIncidents);
router.put("/:id", authMiddleware, updateIncident);
router.delete("/:id", authMiddleware, deleteIncident);

export default router;
