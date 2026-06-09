import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "../../logs");

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFilePath = path.join(logDir, "app.log");

function formatMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metaStr}\n`;
}

export const logger = {
  info: (message, meta) => {
    const logStr = formatMessage("info", message, meta);
    console.log(logStr.trim());
    fs.appendFileSync(logFilePath, logStr);
  },
  error: (message, meta) => {
    const logStr = formatMessage("error", message, meta);
    console.error(logStr.trim());
    fs.appendFileSync(logFilePath, logStr);
  },
  warn: (message, meta) => {
    const logStr = formatMessage("warn", message, meta);
    console.warn(logStr.trim());
    fs.appendFileSync(logFilePath, logStr);
  },
};
