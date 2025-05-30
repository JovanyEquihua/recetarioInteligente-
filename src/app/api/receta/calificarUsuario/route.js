import { db } from "@/libs/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const recetaId = parseInt(searchParams.get("recetaId"));
  const usuarioId = parseInt(searchParams.get("usuarioId"));

  if (isNaN(recetaId) || isNaN(usuarioId)) {
    return new Response(JSON.stringify({ error: "Faltan datos válidos" }), { status: 400 });
  }

  try {
    const calificacion = await db.calificacion.findFirst({
      where: {
        recetaId,
        usuarioId,
      },
      select: {
        puntuacion: true,
      },
    });

    return new Response(
      JSON.stringify({
        calificacionUsuario: calificacion?.puntuacion ?? null,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener calificación:", error);
    return new Response(JSON.stringify({ error: "Error del servidor" }), {
      status: 500,
    });
  }
}
