import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod"; // Importamos Zod

const prisma = new PrismaClient();

// Esquema Zod para la validación de los datos de verificación
const verificationSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  token: z.string().min(6, "El código de verificación es inválido"),
});

export async function POST(req) {
  try {
    const { email, token } = await req.json();

    // Validación con Zod
    const parsedData = verificationSchema.safeParse({ email, token });

    if (!parsedData.success) {
      // Si hay errores de validación, devolvemos un error
      return NextResponse.json({ error: parsedData.error.errors[0].message }, { status: 400 });
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
