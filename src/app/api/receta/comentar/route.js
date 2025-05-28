import { db } from "@/libs/db";

// GET: obtener comentarios por receta
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const recetaId = searchParams.get("recetaId");
console.log("🔍 Buscando comentarios para recetaId:", recetaId); // 👈 Agrega esto

  try {
    const comentarios = await db.comentario.findMany({
    where: { recetaId: parseInt(recetaId) },
  include: { usuario: true }, 
  orderBy: { fechaComentario: "asc" },// Opcional: orden por fecha ascendente
    });

    console.log("📦 Comentarios encontrados:", comentarios.length); // 👈 Agrega esto

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

    return new Response(JSON.stringify(nuevoComentario), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error al comentar" }),
      { status: 500 }
    );
  }
}

