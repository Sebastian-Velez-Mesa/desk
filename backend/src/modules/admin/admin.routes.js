import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Admin module active" });
});

export default router;
