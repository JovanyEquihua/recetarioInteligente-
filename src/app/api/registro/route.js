import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Recibir los datos del usuario desde el frontend
    const { nombre, apellidoP, apellidoM, email, contrase_a, nombreUsuario, rol } = await req.json();

    // Validar que los campos no estén vacíos
    if (!nombre || !apellidoP || !apellidoM || !email || !contrase_a || !nombreUsuario || !rol) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 });
    }
    
    if (contrase_a.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(contrase_a, 10);

    // Guardar el usuario en la base de datos
    const newUser = await prisma.usuario.create({
      data: { nombre, apellidoP, apellidoM, email, contrase_a: hashedPassword, nombreUsuario, rol, fechaRegistro: new Date(), fechaActualizado: new Date(), },
      select: { id: true, nombre: true, apellidoP: true, apellidoM: true, email: true, nombreUsuario: true}
    });

    return NextResponse.json({ message: "Usuario registrado con éxito", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({ error: "Error en el servidor", details: error.message }, { status: 500 });
  }
}