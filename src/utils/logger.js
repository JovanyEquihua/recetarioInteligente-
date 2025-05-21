import winston from "winston";
import path from "path";
import cron from "node-cron";
import fs from "fs";

const baseLogPath = path.join(process.cwd(), "logs");

const createLogger = (filename) =>
  winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: path.join(baseLogPath, filename) }),
    ],
  });

export const logAction = (type, message) => {
  const fileMap = {
    login: "login.log",
    receta: "recetas.log",
    comentario: "comentarios.log",
    admin: "admin.log",
  };

  const logger = createLogger(fileMap[type] || "general.log");
  logger.info({ ...message, timestamp: new Date().toISOString() });
};


cron.schedule("0 0 1 * *", () => {
  Object.values({
    login: "login.log",
    receta: "recetas.log",
    comentario: "comentarios.log",
    admin: "admin.log",
  }).forEach((file) => {
    fs.truncate(path.join(baseLogPath, file), 0, () => {
      console.log(`Logs de ${file} eliminados`);
    });
  });
});