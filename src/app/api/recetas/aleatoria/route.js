import { db } from "@/libs/db";

export async function GET() {
  try {
    // Obtén el número total de recetas
    const totalRecetas = await db.receta.count();

    if (totalRecetas === 0) {
      return new Response(JSON.stringify({ error: "No hay recetas disponibles" }), {
        status: 404,
      });
    }

    // Genera un índice aleatorio
    const randomIndex = Math.floor(Math.random() * totalRecetas);

    // Obtén una receta aleatoria
    const receta = await db.receta.findMany({
      take: 1,
      skip: randomIndex,
      orderBy: { id: "asc" }, // Cambia esto si quieres un orden diferente
    });

    return new Response(JSON.stringify(receta[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener receta aleatoria:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
    });
  }
}