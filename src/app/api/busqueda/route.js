import { db } from "../../../libs/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const nombre = searchParams.get("nombre")?.trim() || "";
  const ingredientes = searchParams.get("ingredientes")?.split(",").map(i => i.trim()).filter(Boolean) || [];

  try {
    const condiciones = {};

    if (nombre) {
      condiciones.titulo = { contains: nombre, mode: "insensitive" };
    }

    if (ingredientes.length > 0) {
      condiciones.ingredientes = {
        some: {
          ingrediente: {
            nombre: { in: ingredientes },
          },
        },
      };
    }

    const recetas = await db.receta.findMany({
      where: condiciones,
      select: {
        id: true,
        titulo: true,
        pasosPreparacion: true,
        imagen: true,
        ingredientes: {
          select: {
            cantidad: true,
            ingrediente: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(recetas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error buscando recetas" }, { status: 500 });
  }
}