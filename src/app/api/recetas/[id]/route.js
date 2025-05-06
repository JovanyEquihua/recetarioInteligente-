import { db } from "../../../../libs/db";

export async function GET(req, context) {
  const { id } = await context.params; // Usa await para obtener los parámetros dinámicos

  try {
    // Busca la receta en la base de datos
    const receta = await db.receta.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        tipoComida: true,
        usuario:true, // Incluye el tipo de comida relacionado
        ingredientes: {
          include: { ingrediente: true }, // Incluye los ingredientes relacionados
        },
      },
    });

    // Si no se encuentra la receta, devuelve un error 404
    if (!receta) {
      return new Response(JSON.stringify({ error: "Receta no encontrada" }), {
        status: 404,
      });
    }

    // Devuelve la receta encontrada
    return new Response(JSON.stringify(receta), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener la receta:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
    });
  }
}