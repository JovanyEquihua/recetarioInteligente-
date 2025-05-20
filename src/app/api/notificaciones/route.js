// app/api/notificaciones/route.js

import { db } from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const usuarioId = parseInt(searchParams.get("usuarioId"));

  try {
    const notificaciones = await db.notificacion.findMany({
      where: { usuarioId },
      orderBy: { fechaNotificacion: "desc" },
    });

    return NextResponse.json(notificaciones);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return NextResponse.json({ error: "Error al obtener notificaciones" }, { status: 500 });
  }
}
