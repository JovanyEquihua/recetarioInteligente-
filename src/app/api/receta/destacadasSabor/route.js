import { db } from "@/libs/db";

export async function GET(req) {
  try {
    const tipoSaborId = req.nextUrl.searchParams.get("tipoSaborId");

    if (!tipoSaborId) {
      return new Response(JSON.stringify({ error: "Falta el tipoSaborId" }), {
        status: 400,
      });
    }

    // Obtener todas las recetas con ese tipo de sabor
    const recetas = await db.receta.findMany({
      where: { idTipoSabor: parseInt(tipoSaborId, 10) },
      include: {
        calificaciones: true,
        tipoComida: true,
        tipoSabor: true,
      },
    });

    if (!recetas || recetas.length === 0) {
      return new Response(JSON.stringify({ error: "No hay recetas" }), {
        status: 404,
      });
    }

    // Calcular el promedio de calificaciones y obtener la receta con el mayor
    const recetaDestacada = recetas
      .map((receta) => {
        const total = receta.calificaciones.reduce((sum, c) => sum + c.valor, 0);
        const promedio =
          receta.calificaciones.length > 0 ? total / receta.calificaciones.length : 0;

  // Aquí haces el console.log del promedio de cada receta
  console.log(`Receta ID: ${receta.id}, Promedio: ${promedio}`);

        return {
          ...receta,
          promedioCalificacion: promedio,
        };
      })
      .sort((a, b) => b.promedioCalificacion - a.promedioCalificacion)[0]; // la mejor calificada

    return new Response(JSON.stringify(recetaDestacada), {
      status: 200,
    });
  } catch (error) {
    console.error("Error en la API:", error);
    return new Response(JSON.stringify({ error: "Error del servidor" }), {
      status: 500,
    });
  }
}
