export function notFoundHandler(req, res) {
  return res.status(404).json({ message: "Ruta no encontrada" });
}

export function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err);
  return res.status(err.statusCode || 500).json({
    message: err.message || "Error interno del servidor"
  });
}
