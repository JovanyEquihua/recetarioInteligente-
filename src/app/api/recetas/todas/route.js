import { db } from "@/libs/db";

export async function GET() {
  try {
    const recetas = await db.receta.findMany({
      include: {
        tipoComida: true,
        usuario: true,
        ingredientes: { include: { ingrediente: true } },
      },
    });

    return new Response(JSON.stringify(recetas), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener recetas:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
