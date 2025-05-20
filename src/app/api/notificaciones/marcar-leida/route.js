import { db } from "@/libs/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { notificacionId } = await req.json();

    await db.notificacion.update({
      where: { id: parseInt(notificacionId) },
      data: { leida: true },
    });

    return NextResponse.json({ mensaje: "Notificación marcada como leída" }, { status: 200 });
  } catch (error) {
    console.error("Error al marcar como leída:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
