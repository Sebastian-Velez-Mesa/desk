import { exec } from "child_process";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { logger } from "../src/utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const dbUrl = process.env.DATABASE_URL;
const backupFile = process.argv[2];

if (!backupFile) {
  console.error("Por favor, especifica el archivo de backup a restaurar.");
  console.log("Uso: node restore.js <ruta-al-archivo-backup>");
  process.exit(1);
}

if (!fs.existsSync(backupFile)) {
  console.error(`El archivo ${backupFile} no existe.`);
  process.exit(1);
}

console.log(`Iniciando restauración desde ${backupFile}...`);
const startTime = Date.now();

exec(`psql "${dbUrl}" -f "${backupFile}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al restaurar el backup: ${error.message}`);
    logger.error(`Fallo al restaurar backup`, { error: error.message, file: backupFile });
    process.exit(1);
  }

  const duration = Date.now() - startTime;
  console.log(`Restauración completada en ${duration}ms`);
  logger.info(`Restauración de base de datos completada`, { file: backupFile, durationMs: duration });
});
