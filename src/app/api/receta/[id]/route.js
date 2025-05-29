// /api/receta/[id]/route.js
import { db } from "@/libs/db";

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const comentarioEliminado = await db.comentario.delete({
      where: { id: parseInt(id) },
    });

    return new Response(
      JSON.stringify({ message: "Comentario eliminado correctamente" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el comentario:", error);
    return new Response(
      JSON.stringify({ error: "No se pudo eliminar el comentario" }),
      { status: 500 }
    );
  }
}
