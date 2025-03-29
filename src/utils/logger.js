// Importamos el módulo winston para el registro de logs
import winston from "winston";
// Importamos el módulo path para manejar rutas de archivos
import path from "path";
import cron from "node-cron";
import fs from "fs";

// Definimos la ruta del archivo de log
const logFilePath = path.join(process.cwd(), "logs", "login.log");

// Creamos un logger utilizando winston
const logger = winston.createLogger({
  // Nivel de log (info, en este caso)
  level: "info",
  // Formato del log (JSON, en este caso)
  format: winston.format.json(),
  // Transportes para el logger (dónde se guardarán los logs)
  transports: [
    // Guardar los logs en un archivo
    new winston.transports.File({ filename: logFilePath }),
  ],
});

// Eliminar logs cada mes
cron.schedule("0 0 1 * *", () => {
    fs.truncate(logFilePath, 0, () => {
      console.log("Logs de inicio de sesión eliminados");
    });
  });
  
// Exportamos el logger para que pueda ser utilizado en otros archivos
export default logger;