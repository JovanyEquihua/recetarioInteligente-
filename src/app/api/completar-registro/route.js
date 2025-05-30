import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();
    const { email, nombre, apellidoP, apellidoM, nombreUsuario } = data;

    // Verificar si el usuario ya existe por email
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (!existingUser) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    // Verificar si el nombreUsuario ya está en uso por otro usuario
    const usernameTaken = await prisma.usuario.findFirst({
      where: {
        nombreUsuario,
        NOT: { email }, // evitar conflicto con su propio username si ya lo tiene
      },
    });
    if (usernameTaken) {
      return NextResponse.json({ error: "El nombre de usuario ya está en uso." }, { status: 400 });
    }

    // Actualizar usuario
    const updatedUser = await prisma.usuario.update({
      where: { email },
      data: {
        nombre,
        apellidoP,
        apellidoM,
        nombreUsuario,
        contrase_a: null,
      },
    });

    return NextResponse.json({ message: "Registro completado correctamente", user: updatedUser });
  } catch (error) {
    console.error("Error al completar el registro:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
