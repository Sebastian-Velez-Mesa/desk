import { logger } from "../utils/logger.js";

export function notFoundHandler(req, res) {
  logger.warn(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  return res.status(404).json({ message: "Ruta no encontrada" });
}

export function errorHandler(err, req, res, next) {
  logger.error(err.message, { stack: err.stack, url: req.originalUrl });
  const isProduction = process.env.NODE_ENV === "production";
  return res.status(err.statusCode || 500).json({
    message: err.message || "Error interno del servidor",
    ...(isProduction ? {} : { stack: err.stack })
  });
}
