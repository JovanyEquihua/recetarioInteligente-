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
         calificaciones: {
    select: {
      puntuacion: true,
    },
  },
        tipoComida: true,
        tipoSabor: true,
      },
    });

    if (!recetas || recetas.length === 0) {
      return new Response(JSON.stringify({ error: "No hay recetas" }), {
        status: 404,
      });
    }

    const recetaDestacada = recetas
  .map((receta) => {
    const calificacionesValidas = receta.calificaciones.filter(
      (c) => typeof c.puntuacion === "number" && !isNaN(c.puntuacion)
    );

    const total = calificacionesValidas.reduce(
      (sum, c) => sum + c.puntuacion,
      0
    );

    const promedio =
      calificacionesValidas.length > 0
        ? total / calificacionesValidas.length
        : 0;

    console.log(
      `➡️ Receta ID ${receta.id}: Calificaciones = [${calificacionesValidas.map(
        (c) => c.puntuacion
      )}], Promedio = ${promedio.toFixed(2)}`
    );

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
