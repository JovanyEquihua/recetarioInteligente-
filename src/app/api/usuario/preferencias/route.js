import { db } from "@/libs/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/libs/authOptions"

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return Response.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { preferencias, primerInicioSesion } = body

    const updatedUser = await db.usuario.update({
      where: { id: session.user.id },
      data: {
        preferencias,
        primerInicioSesion,
      },
    })

    return Response.json({
      message: "Preferencias guardadas correctamente",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error al guardar preferencias:", error)
    return Response.json(
      {
        error: "Error al guardar preferencias",
        details: error.message,
      },
      { status: 500 }
    )
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
const tipo = searchParams.get("tipo"); // puede ser "favoritos"

  const session = await getServerSession(authOptions)

  if (!session) {
    return Response.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const usuario = await db.usuario.findUnique({
      where: { id: session.user.id },
      select: { preferencias: true },
    })

    if (!usuario) {
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 })
    }
    
    if (tipo === "favoritos") {
      const recetasFavoritas = await db.receta.findMany({
        where: {
          favoritos: {
            some: { usuarioId: session.user.id },
          },
        },
        select: {
          id: true,
          titulo: true,
          imagen: true,
          fechaCreacion: true,
          tiempoPreparacion: true,
          porciones: true,
          dificultad: true,
          
        },
      });
  
      return Response.json({ recetas: recetasFavoritas });
    }
  

    const recetas = await db.receta.findMany({
      where: { usuarioId: session.user.id },
      select: {
        id: true,
    titulo: true,
    imagen: true,
    fechaCreacion: true,
    tiempoPreparacion: true,
    porciones: true,
    dificultad: true,
    usuarioId: true,
      },
    });

    return Response.json({ preferencias: usuario.preferencias,recetas })
  } catch (error) {
    console.error("Error al obtener preferencias:", error)
    return Response.json(
      {
        error: "Error al obtener preferencias",
        details: error.message,
      },
      { status: 500 }
    )
  }
}

