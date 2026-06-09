import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { logger } from "../../utils/logger.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function login(req, res, next) {
  try {
    const parsed = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: parsed.email }
    });
    if (!user || !user.isActive) {
      logger.warn(`Intento fallido de inicio de sesión (usuario no encontrado o inactivo)`, { email: parsed.email, ip: req.ip });
      return res.status(401).json({ message: "Credenciales invalidas" });
    }
    const valid = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!valid) {
      logger.warn(`Intento fallido de inicio de sesión (contraseña incorrecta)`, { email: parsed.email, ip: req.ip });
      return res.status(401).json({ message: "Credenciales invalidas" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    logger.info(`Inicio de sesión exitoso`, { userId: user.id, email: user.email, role: user.role, ip: req.ip });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    logger.error(`Error en login`, { error: error.message, stack: error.stack, ip: req.ip });
    next(error);
  }
}

export async function me(req, res) {
  return res.json({ user: req.user });
}
