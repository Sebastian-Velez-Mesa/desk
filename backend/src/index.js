import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import incidentsRoutes from "./modules/incidents/incidents.routes.js";
import { authLimiter } from "./middlewares/rate-limit.middleware.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined"));

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Backend funcionando correctamente" });
});

app.use("/auth", authLimiter, authRoutes);
app.use("/admin", adminRoutes);
app.use("/incidents", incidentsRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor backend activo en http://localhost:${PORT}`);
});
