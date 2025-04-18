import { db } from "@/libs/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/libs/authOptions"
import { BioRhyme } from "next/font/google"


export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()

  const updatedUser = await db.usuario.update({
    where: { id: session.user.id },
    data: {
      nombre: body.nombre,
      apellidoP: body.apellidoP,
      apellidoM: body.apellidoM,
      nombreUsuario: body.nombreUsuario,
      fotoPerfil: body.fotoPerfil,
      titulo: body.titulo,
      biografia: body.biografia
    }
  })

  return Response.json({ message: "Perfil actualizado correctamente", user: updatedUser })
 
}
