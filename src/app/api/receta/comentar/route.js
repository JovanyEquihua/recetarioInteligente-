
import { db } from "@/libs/db";

// GET: obtener comentarios por receta
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const recetaId = searchParams.get("recetaId");


  try {
    const comentarios = await db.comentario.findMany({
      where: { recetaId: parseInt(recetaId) },
      include: { usuario: true },
      orderBy: { fechaComentario: "asc" },
    });

    return new Response(JSON.stringify(comentarios), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error al obtener comentarios" }),
      { status: 500 }
    );
  }
}

// POST: agregar un nuevo comentario
export async function POST(req) {

  const { recetaId, comentario, usuarioId } = await req.json();

  if (!usuarioId) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
    });
  }

  try {
    const receta = await db.receta.findUnique({
      where: { id: recetaId },
    });

    if (!receta) {
      return new Response(JSON.stringify({ error: "Receta no encontrada" }), {
        status: 404,
      });
    }

    const nuevoComentario = await db.comentario.create({
      data: {
        comentario,
        usuarioId,
        recetaId,
      },
      include: {
        usuario: true,
      },
    });

  // Obtener información del autor del comentario
    const usuario = await db.usuario.findUnique({
      where: { id: usuarioId },
      select: { nombreUsuario: true },
    });

    // Si el usuario que comenta no es el dueño de la receta, enviar notificación
    if (receta.usuarioId !== usuarioId) {
      await db.notificacion.create({
        data: {
          usuarioId: receta.usuarioId, // Dueño de la receta
          mensaje: `${usuario.nombreUsuario} comentó tu receta.`,
        },
      });
    }

    return new Response(JSON.stringify(nuevoComentario), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error al comentar" }),
      { status: 500 }
    );
  }
}

// PUT: editar un comentario existente
export async function PUT(req) {
  const { comentarioId, comentario, usuarioId } = await req.json();

  try {
    const existente = await db.comentario.findUnique({
      where: { id: comentarioId },
    });

    if (!existente || existente.usuarioId !== usuarioId) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 403,
      });

    }

    const actualizado = await db.comentario.update({
      where: { id: comentarioId },
      data: { comentario },
    });

    return new Response(JSON.stringify(actualizado), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error al editar comentario" }),
      { status: 500 }
    );
  }
}

// DELETE: eliminar un comentario existente
export async function DELETE(req) {
  const { comentarioId, usuarioId } = await req.json();

  try {
    const existente = await db.comentario.findUnique({
      where: { id: comentarioId },
    });

    if (!existente || existente.usuarioId !== usuarioId) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 403,
      });
    }

    await db.comentario.delete({
      where: { id: comentarioId },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error al eliminar comentario" }),
      { status: 500 }
    );
  }
}


