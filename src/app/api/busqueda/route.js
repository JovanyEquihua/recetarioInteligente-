import { db } from "../../../libs/db";
import { NextResponse } from 'next/server';


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const nombre = searchParams.get("nombre") || "";
  const ingredientes = searchParams.get("ingredientes")?.split(",").map(i => i.trim()) || [];

  try {
    const recetas = await db.receta.findMany({
        where: {
          titulo: { contains: nombre, mode: "insensitive" },
          ...(ingredientes.length > 0 && {
            ingredientes: {
              some: {
                ingrediente: {
                  nombre: { in: ingredientes },
                },
              },
            },
          }),
        },
        include: {
          ingredientes: {
            include: { ingrediente: true },
          },
        },
      });
    return NextResponse.json(recetas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error buscando recetas" }, { status: 500 });
  }
}