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
const backupDir = process.env.BACKUP_DIR || path.join(__dirname, "../backups");

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

console.log(`Iniciando backup de base de datos a ${backupFile}...`);

// Se asume que pg_dump está en el PATH
exec(`pg_dump "${dbUrl}" -F p -f "${backupFile}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al crear el backup: ${error.message}`);
    logger.error(`Fallo al crear backup`, { error: error.message });
    process.exit(1);
  }
  
  const stats = fs.statSync(backupFile);
  if (stats.size === 0) {
    console.error("El archivo de backup está vacío.");
    logger.error("Archivo de backup generado vacío.");
    process.exit(1);
  }

  console.log(`Backup generado exitosamente: ${backupFile} (${stats.size} bytes)`);
  logger.info(`Backup de base de datos generado`, { file: backupFile, size: stats.size });
});
