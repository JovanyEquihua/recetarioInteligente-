import { db } from "@/libs/db"// Asegúrate de importar tu cliente de Prisma
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions"

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  try {
    // Consulta el usuario en la base de datos
    const usuario = await db.usuario.findUnique({
      where: { id: session.user.id },
    });

    if (!usuario) {
      return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 404 });
    }

    // Si `primerInicioSesion` es false, actualízalo a true
    if (!usuario.primerInicioSesion) {
      await db.usuario.update({
        where: { id: session.user.id },
        data: { primerInicioSesion: true },
      });

      return new Response(JSON.stringify({ primerInicioSesion: false }), { status: 200 });
    }

    return new Response(JSON.stringify({ primerInicioSesion: true }), { status: 200 });
  } catch (error) {
    console.error("Error al consultar o actualizar primerInicioSesion:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
  }
}