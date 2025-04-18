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

    return Response.json({ preferencias: usuario.preferencias })
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
