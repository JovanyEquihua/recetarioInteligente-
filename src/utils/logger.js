// Importa librerías necesarias
import winston from "winston";        // Para registrar logs
import path from "path";              // Para construir rutas de forma segura
import cron from "node-cron";         // Para tareas programadas (como vaciar logs)
import fs from "fs";                  // Para manejar archivos (leer, escribir, truncar, etc.)

// Define la ruta base donde se guardarán los archivos de log
const baseLogPath = path.join(process.cwd(), "logs");

// Función que crea un logger configurado con Winston para un archivo específico
const createLogger = (filename) =>
  winston.createLogger({
    level: "info",                    // Solo registra logs de nivel 'info' o superior
    format: winston.format.json(),   // Guarda los logs en formato JSON
    transports: [
      new winston.transports.File({
        filename: path.join(baseLogPath, filename) // Ruta completa del archivo de log
      }),
    ],
  });

// Función principal para registrar una acción en el log correspondiente
export const logAction = (type, message) => {
  // Mapea los tipos de acción a archivos de log específicos
  const fileMap = {
    login: "login.log",
    receta: "recetas.log",
    comentario: "comentarios.log",
    admin: "admin.log",
  };

  // Crea el logger para el tipo indicado, o usa 'general.log' como fallback
  const logger = createLogger(fileMap[type] || "general.log");

  // Escribe la información en el archivo, añadiendo timestamp automáticamente
  logger.info({ ...message, timestamp: new Date().toISOString() });
};

// Programa una tarea que se ejecuta el día 1 de cada mes a las 00:00
cron.schedule("0 0 1 * *", () => {
  // Por cada archivo de log definido, vacía su contenido (truncado)
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
