import { getServerSession } from "next-auth"
import { authOptions } from "@/libs/authOptions"
import { db } from "@/libs/db"
import EditarPerfil from "@/app/components/EditarPerfil/EditarPerfil"
import Perfil from "@/app/components/EditarPerfil/Perfil"

export default async function PerfilPage() {
  const session = await getServerSession(authOptions)

  if (!session) return <p>No estás logueado</p>

  const usuario = await db.usuario.findUnique({
    where: { email: session.user.email },
    select: {
      nombre: true,
      apellidoP: true,
      apellidoM: true,
      email: true,
      nombreUsuario: true,
      fotoPerfil: true,
      titulo: true,
      biografia: true,

    }
  })

  return (
    // <EditarPerfil user={usuario} />
    <Perfil user={usuario} />
  )
}
