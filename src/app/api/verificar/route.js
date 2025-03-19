import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Buscar el código en la base de datos
    const verificationRecord = await prisma.verificationToken.findUnique({ where: { email } });

    if (!verificationRecord || verificationRecord.token !== token || verificationRecord.expires < new Date()) {
      return NextResponse.json({ error: "Código inválido o expirado" }, { status: 400 });
    }

    // Marcar usuario como verificado
    await prisma.usuario.update({
      where: { email },
      data: { verificado: true },
    });

    // Eliminar el código después de usarlo
    await prisma.verificationToken.delete({ where: { email } });

    return NextResponse.json({ message: "Cuenta verificada con éxito" }, { status: 200 });

  } catch (error) {
    console.error("Error en la verificación:", error);
    return NextResponse.json({ error: "Error en la verificación" }, { status: 500 });
  }
}