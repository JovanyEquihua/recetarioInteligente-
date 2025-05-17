import { getServerSession } from "next-auth"
import { authOptions } from "@/libs/authOptions"
import { db } from "@/libs/db"
import dynamic from 'next/dynamic'

// Carga dinámica del componente Perfil para mejor rendimiento
const DynamicPerfil = dynamic(
  () => import('@/app/components/EditarPerfil/Perfil'),
  {
    loading: () => <p>Cargando perfil...</p>,
    ssr: false // Solo si el componente usa APIs del navegador
  }
)

export default async function PerfilPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Debes iniciar sesión para ver esta página</p>
      </div>
    )
  }

  try {
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

    if (!usuario) {
      return <p className="text-center p-4">Usuario no encontrado</p>
    }

    return <DynamicPerfil user={usuario} />
    
  } catch (error) {
    console.error("Error cargando perfil:", error)
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error al cargar el perfil</p>
      </div>
    )
  }
}