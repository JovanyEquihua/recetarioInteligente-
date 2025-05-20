import { db } from "../../../libs/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const usuarios = await db.usuario.findMany({
      select: {
        nombre: true,
        apellidoP: true,
        apellidoM: true,
        email: true,
        fechaRegistro: true,
        rol: true,
      },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}
