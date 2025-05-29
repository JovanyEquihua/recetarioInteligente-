import { db } from "@/libs/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const recetaId = parseInt(searchParams.get("recetaId"));
  const usuarioId = parseInt(searchParams.get("usuarioId"));

  if (!recetaId) {
    return new Response(JSON.stringify({ error: "recetaId es obligatorio" }), { status: 400 });
  }

  try {
    let calificacionUsuario = null;
    if (usuarioId) {
      calificacionUsuario = await db.calificacion.findFirst({
        where: { recetaId, usuarioId },
      });
    }

    const promedioObj = await db.calificacion.aggregate({
      where: { recetaId },
      _avg: { puntuacion: true },
    });

    const promedio = promedioObj._avg.puntuacion || 0;

    return new Response(
      JSON.stringify({
        promedio,
        calificacionUsuario: calificacionUsuario?.puntuacion || null,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener calificación:", error);
    return new Response(JSON.stringify({ error: "Error al obtener calificación" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const { recetaId, calificacion, usuario } = await req.json();

    if (!recetaId || !calificacion || !usuario) {
      return new Response(JSON.stringify({ error: "Faltan datos obligatorios" }), { status: 400 });
    }

    // Verifica si ya existe una calificación previa
    const existente = await db.calificacion.findFirst({
      where: {
        recetaId,
        usuarioId: usuario,
      },
    });

    if (existente) {
      // Actualiza la calificación existente
      await db.calificacion.update({
        where: { id: existente.id },
        data: {
          puntuacion: calificacion,
          fechaCalificacion: new Date(),
        },
      });
    } else {
      // Crea una nueva calificación
      await db.calificacion.create({
        data: {
          recetaId,
          usuarioId: usuario,
          puntuacion: calificacion,
          fechaCalificacion: new Date(),
        },
      });
    }

    return new Response(JSON.stringify({ message: "Calificación guardada con éxito" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error al guardar calificación:", error);
    return new Response(JSON.stringify({ error: "Error al guardar calificación" }), {
      status: 500,
    });
  }
}



