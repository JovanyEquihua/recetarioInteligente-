// /src/app/api/logs/recetas/route.js
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const logFilePath = path.join(process.cwd(), "logs", "recetas.log");
    const fileContent = await readFile(logFilePath, "utf-8");

    // Convertir cada línea JSON a objeto
    const lines = fileContent.trim().split("\n").filter(Boolean);
    const logs = lines
      .map((line) => {
        try {
          const parsed = JSON.parse(line);
          return parsed.message; // accedemos a la info real
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return Response.json(logs); // ← esto debe ser un array
  } catch (error) {
    console.error("Error leyendo el log:", error);
    return Response.json([]); // ← devolver array vacío para evitar que el frontend crashee
  }
}
