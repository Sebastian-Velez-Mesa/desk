import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../../middlewares/auth.middleware.js";
import { logger } from "../../utils/logger.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", (req, res) => {
  logger.info(`Acceso a panel de administración por usuario ${req.user.id}`);
  res.json({ message: "Admin module active" });
});

export default router;
