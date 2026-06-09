import { prisma } from "../../lib/prisma.js";
import { sanitizeText } from "../../utils/sanitize.js";
import { z } from "zod";

// Esquema de validación con Zod
const incidentSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(5, "La descripción debe tener al menos 5 caracteres"),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"], {
    errorMap: () => ({ message: "Severidad debe ser LOW, MEDIUM o HIGH" }),
  }),
  reporterEmail: z.string().email("Debe ser un email válido"),
  containsPersonal: z.boolean(),
});

/**
 * Crea un nuevo incidente.
 * Valida con Zod, sanitiza title y description, normaliza email a minúsculas.
 */
export async function createIncident(req, res) {
  try {
    const parsed = incidentSchema.parse(req.body);

    const incident = await prisma.incident.create({
      data: {
        title: sanitizeText(parsed.title),
        description: sanitizeText(parsed.description),
        severity: parsed.severity,
        reporterEmail: parsed.reporterEmail.toLowerCase(),
        containsPersonal: parsed.containsPersonal,
        createdById: req.user.id,
      },
    });

    return res.status(201).json(incident);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: "Error al crear el incidente" });
  }
}

/**
 * Lista los últimos 20 incidentes.
 * Enmascara el reporterEmail si el usuario no es ADMIN.
 */
export async function listIncidents(req, res) {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const masked = incidents.map((incident) => {
      if (req.user.role === "ADMIN") {
        return incident;
      }
      return {
        ...incident,
        reporterEmail: incident.reporterEmail.replace(
          /(.{2}).+(@.+)/,
          "$1***$2"
        ),
      };
    });

    return res.status(200).json(masked);
  } catch (error) {
    return res.status(500).json({ message: "Error al listar los incidentes" });
  }
}

export async function updateIncident(req, res) {
  try {
    const { id } = req.params;
    const { severity, description } = req.body;
    
    const incident = await prisma.incident.findUnique({ where: { id: Number(id) } });
    if (!incident) return res.status(404).json({ message: "Incidente no encontrado" });

    if (incident.createdById !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "No autorizado para actualizar este incidente" });
    }

    const updated = await prisma.incident.update({
      where: { id: Number(id) },
      data: {
        severity: severity || incident.severity,
        description: description ? sanitizeText(description) : incident.description
      }
    });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el incidente" });
  }
}

export async function deleteIncident(req, res) {
  try {
    const { id } = req.params;
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Solo administradores pueden eliminar incidentes" });
    }

    await prisma.incident.delete({ where: { id: Number(id) } });
    return res.status(200).json({ message: "Incidente eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el incidente" });
  }
}
