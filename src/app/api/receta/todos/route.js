import { db } from "@/libs/db";

export async function GET() {
  try {
    const comentarios = await db.comentario.findMany({
      include: {
        usuario: true, // Info del usuario
        receta: true,  // Info de la receta
      },
      orderBy: { fechaComentario: 'desc' }, // Usa tu campo fechaComentario, no createdAt
    });

    return new Response(JSON.stringify(comentarios), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener comentarios" }),
      { status: 500 }
    );
  }
}
