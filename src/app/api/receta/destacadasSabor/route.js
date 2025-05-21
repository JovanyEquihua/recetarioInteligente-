import { db } from "@/libs/db"; // Ajusta esto según tu proyecto

export async function GET(req) {
  try {
    const tipoSaborId = req.nextUrl.searchParams.get("tipoSaborId");

    if (!tipoSaborId) {
      return new Response(JSON.stringify({ error: "Falta el tipoSaborId" }), {
        status: 400,
      });
    }

    // Aquí obtienes la receta destacada según tipoSaborId
    const receta = await db.receta.findFirst({
      where: { idTipoSabor: parseInt(tipoSaborId, 10) },
      include: {
        tipoComida: true,
        tipoSabor: true,
        calificaciones: true,
      },
    });

    if (!receta) {
      // return new Response(JSON.stringify({ error: "No se encontró receta destacada" }), {
      //   status: 404,
      // });
    }

    return new Response(JSON.stringify(receta), {
      status: 200,
    });
  } catch (error) {
    console.error("Error en la API:", error);
    return new Response(JSON.stringify({ error: "Error del servidor" }), {
      status: 500,
    });
  }
}

