import { db } from "@/libs/db";
import logger from "@/utils/logger"; // Importa tu logger
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";


export async function GET(req, context) {
  const { id } = await context.params; // Usa await para obtener los parámetros dinámicos
const session = await getServerSession(authOptions);
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


//API para borrar una receta
export async function DELETE(req, context) {
  const { id } = await context.params; // Usa await para obtener los parámetros dinámicos

  try {
    // Busca la receta en la base de datos
    const receta = await db.receta.findUnique({
      where: { id: parseInt(id, 10) },
    });

    // Si no se encuentra la receta, devuelve un error 404
    if (!receta) {
      return new Response(JSON.stringify({ error: "Receta no encontrada" }), {
        status: 404,
      });
    }

    // Elimina la receta
    await db.receta.delete({
      where: { id: parseInt(id, 10) },
    });


    // Devuelve una respuesta exitosa
    return new Response(
      JSON.stringify({ message: "Receta eliminada correctamente" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error al eliminar la receta:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
    });
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

      logger.info({
        action: "edit-image",
        recetaId: id,
        usuarioId: session?.user?.id || "desconocido",
        email: session?.user?.email || "desconocido",
        timestamp: new Date().toISOString(),
        status: "success",
        message: "Imagen de receta editada por el usuario",
      });

      return new Response(JSON.stringify(recetaActualizada), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Actualizar ingredientes
    if (body.ingredientes) {
      // Elimina los ingredientes actuales de la receta
      await db.recetaIngrediente.deleteMany({
        where: { recetaId: parseInt(id, 10) },
      });

      // Crea los nuevos ingredientes y relaciones
      const nuevosIngredientes = await Promise.all(
        body.ingredientes.map(async (ing) => {
          // Busca o crea el ingrediente
          let ingrediente = await db.ingrediente.findFirst({
            where: {
              nombre: ing.nombre,
              Tipo: ing.tipo,
            },
          });
          if (!ingrediente) {
            ingrediente = await db.ingrediente.create({
              data: {
                nombre: ing.nombre,
                Tipo: ing.tipo,
              },
            });
          }
          // Crea la relación RecetaIngrediente
          return db.recetaIngrediente.create({
            data: {
              recetaId: parseInt(id, 10),
              ingredienteId: ingrediente.id,
              cantidad: ing.cantidad,
            },
          });
        })
      );

      logger.info({
        action: "edit-ingredients",
        recetaId: id,
        usuarioId: session?.user?.id || "desconocido",
        email: session?.user?.email || "desconocido",
        timestamp: new Date().toISOString(),
        status: "success",
        message: "Ingredientes de receta editados por el usuario",
      });

      return new Response(JSON.stringify({ ingredientes: nuevosIngredientes }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    // ...existing code...

    // Actualizar detalles de la receta
    if (
      body.dificultad !== undefined ||
      body.tiempoPreparacion !== undefined ||
      body.porciones !== undefined ||
      body.idTipoComida !== undefined ||
      body.pasosPreparacion !== undefined
    ) {
      const recetaActualizada = await db.receta.update({
        where: { id: parseInt(id, 10) },
        data: {
          ...(body.dificultad !== undefined && { dificultad: body.dificultad }),
          ...(body.tiempoPreparacion !== undefined && { tiempoPreparacion: body.tiempoPreparacion }),
          ...(body.porciones !== undefined && { porciones: body.porciones }),
          ...(body.idTipoComida !== undefined && { idTipoComida: body.idTipoComida }),
          ...(body.pasosPreparacion !== undefined && { pasosPreparacion: body.pasosPreparacion }),
        },
      });

      logger.info({
        action: "edit-details",
        recetaId: id,
        usuarioId: session?.user?.id || "desconocido",
        email: session?.user?.email || "desconocido",
        timestamp: new Date().toISOString(),
        status: "success",
        message: "Detalles de receta editados por el usuario",
      });

      return new Response(JSON.stringify(recetaActualizada), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }


    // Si no se envió nada válido
    return new Response(JSON.stringify({ error: "No se proporcionó información válida para actualizar" }), {
      status: 400,
    });
  } catch (error) {
    logger.error({
      action: "edit",
      recetaId: id,
      usuarioId: session?.user?.id || "desconocido",
      email: session?.user?.email || "desconocido",
      timestamp: new Date().toISOString(),
      status: "error",
      message: error.message,
    });
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
    });
  }
}