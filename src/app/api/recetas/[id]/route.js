import { db } from "@/libs/db";
import { logAction } from "@/utils/logger"; // Importa tu logger
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";

export async function GET(req, context) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  try {
    const receta = await db.receta.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        tipoComida: true,
        usuario: true,
        ingredientes: { include: { ingrediente: true } },
      },
    });

    if (!receta) {
      return new Response(JSON.stringify({ error: "Receta no encontrada" }), { status: 404 });
    }

    return new Response(JSON.stringify(receta), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logAction("recetas", {
      recetaId: id,
      usuarioId: session?.user?.id || "desconocido",
      timestamp: new Date().toISOString(),
      status: "error",
      accion: error.message,
    });
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}

export async function DELETE(req, context) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  try {
    const receta = await db.receta.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!receta) {
      return new Response(JSON.stringify({ error: "Receta no encontrada" }), { status: 404 });
    }

    await db.receta.delete({
      where: { id: parseInt(id, 10) },
    });

    logAction("recetas", {
      recetaId: id,
      usuarioId: session?.user?.id || "desconocido",
      timestamp: new Date().toISOString(),
      status: "success",
      accion: "Receta eliminada correctamente",
    });

    return new Response(JSON.stringify({ message: "Receta eliminada correctamente" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logAction("recetas", {
      recetaId: id,
      usuarioId: session?.user?.id || "desconocido",
      timestamp: new Date().toISOString(),
      status: "error",
      accion: error.message,
    });
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}

export async function PATCH(req, context) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  try {
    const body = await req.json();

    // Actualizar imagen
    if (body.imagen) {
      const recetaActualizada = await db.receta.update({
        where: { id: parseInt(id, 10) },
        data: { imagen: body.imagen },
      });

    logAction("recetas", {
        recetaId: id,
        usuarioId: session?.user?.id || "desconocido",
        timestamp: new Date().toISOString(),
        status: "success",
        accion: "Imagen de receta editada",
      });

      return new Response(JSON.stringify(recetaActualizada), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Actualizar ingredientes
    if (body.ingredientes) {
      await db.recetaIngrediente.deleteMany({
        where: { recetaId: parseInt(id, 10) },
      });

      const nuevosIngredientes = await Promise.all(
        body.ingredientes.map(async (ing) => {
          let ingrediente = await db.ingrediente.findFirst({
            where: { nombre: ing.nombre, Tipo: ing.tipo },
          });
          if (!ingrediente) {
            ingrediente = await db.ingrediente.create({
              data: { nombre: ing.nombre, Tipo: ing.tipo },
            });
          }
          return db.recetaIngrediente.create({
            data: {
              recetaId: parseInt(id, 10),
              ingredienteId: ingrediente.id,
              cantidad: ing.cantidad,
            },
          });
        })
      );

    logAction("recetas", {
        recetaId: id,
        usuarioId: session?.user?.id || "desconocido",
        timestamp: new Date().toISOString(),
        status: "success",
        accion: "Ingredientes de receta actualizados",
      });

      return new Response(JSON.stringify({ ingredientes: nuevosIngredientes }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Actualizar detalles
    if (
      body.titulo !== undefined ||
      body.dificultad !== undefined ||
      body.tiempoPreparacion !== undefined ||
      body.porciones !== undefined ||
      body.idTipoComida !== undefined ||
      body.pasosPreparacion !== undefined
    ) {
      const recetaActualizada = await db.receta.update({
        where: { id: parseInt(id, 10) },
        data: {
          ...(body.titulo !== undefined && { titulo: body.titulo }),
          ...(body.dificultad !== undefined && { dificultad: body.dificultad }),
          ...(body.tiempoPreparacion !== undefined && { tiempoPreparacion: body.tiempoPreparacion }),
          ...(body.porciones !== undefined && { porciones: body.porciones }),
          ...(body.idTipoComida !== undefined && { idTipoComida: body.idTipoComida }),
          ...(body.pasosPreparacion !== undefined && { pasosPreparacion: body.pasosPreparacion }),
        },
      });

    logAction("recetas", {
        recetaId: id,
        usuarioId: session?.user?.id || "desconocido",
        timestamp: new Date().toISOString(),
        status: "success",
        accion: "Detalles de receta actualizados",
      });

      return new Response(JSON.stringify(recetaActualizada), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "No se proporcionó información válida para actualizar" }), { status: 400 });
  } catch (error) {
    logAction("recetas", {
      recetaId: id,
      usuarioId: session?.user?.id || "desconocido",
      timestamp: new Date().toISOString(),
      status: "error",
      accion: error.message,
    });
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}
