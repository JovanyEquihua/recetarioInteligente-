import { db } from "@/libs/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { usuarioId } = await req.json();

    await db.notificacion.updateMany({
      where: {
        usuarioId: parseInt(usuarioId),
        leida: false,
      },
      data: {
        leida: true,
      },
    });

    return NextResponse.json({ mensaje: "Todas las notificaciones marcadas como leídas" }, { status: 200 });
  } catch (error) {
    console.error("Error al marcar todas como leídas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
