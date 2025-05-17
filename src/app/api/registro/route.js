import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { z } from "zod"; // Importamos Zod

const prisma = new PrismaClient();

// Esquema Zod para la validación de los datos de registro
const registroSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellidoP: z.string().min(1, "El apellido paterno es obligatorio"),
  apellidoM: z.string().min(1, "El apellido materno es obligatorio"),
  email: z.string().email("Correo electrónico no válido"),
  contrase_a: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  nombreUsuario: z.string().min(1, "El nombre de usuario es obligatorio"),
  rol: z.enum(["USUARIO", "ADMIN", "MODERATOR"], { errorMap: () => ({ message: "Rol no válido" }) }),
});

export async function POST(req) {
  try {
    // Recibimos los datos desde el frontend
    const { nombre, apellidoP, apellidoM, email, contrase_a, nombreUsuario, rol } = await req.json();

    // Validación con Zod
    const parsedData = registroSchema.safeParse({
      nombre,
      apellidoP,
      apellidoM,
      email,
      contrase_a,
      nombreUsuario,
      rol,
    });

    if (!parsedData.success) {
      // Si hay errores de validación, devolvemos un error
      return NextResponse.json({ error: parsedData.error.errors[0].message }, { status: 400 });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contrase_a, 10);

    // Crear el usuario en la base de datos
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        apellidoP,
        apellidoM,
        email,
        contrase_a: hashedPassword,
        nombreUsuario,
        rol,
        fechaRegistro: new Date(),
        fechaActualizado: new Date(),
        verificado: false,
      },
    })

    // Generar el código de verificación
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar el código en la base de datos
    await prisma.verificationToken.create({
      data: {
        email,
        token: verificationCode,
        expires: new Date(Date.now() + 3600000), // Expira en 1 hora
      },
    });

    // Configurar nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar el correo con el código de verificación
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Código de verificación",
      text: `Tu código de verificación es: ${verificationCode}. Expira en 1 hora.`,
    });

    return NextResponse.json({
      message: "Usuario registrado. Ingresa el código que enviamos a tu correo para verificar tu cuenta",
      user: newUser,
    }, { status: 201 });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json({ error: "Error en el servidor", details: error.message }, { status: 500 });
  }
}
