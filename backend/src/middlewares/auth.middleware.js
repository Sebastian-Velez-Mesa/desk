import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Intento de acceso sin token', { ip: req.ip, url: req.originalUrl });
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Intento de acceso con token inválido', { ip: req.ip, url: req.originalUrl });
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    logger.warn('Acceso denegado a ruta de administrador', { userId: req.user?.id, role: req.user?.role, url: req.originalUrl });
    res.status(403).json({ message: 'Acceso denegado: Se requieren permisos de administrador' });
  }
};
