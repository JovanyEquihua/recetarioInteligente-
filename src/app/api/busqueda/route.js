import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const nombre = searchParams.get("nombre") || "";
  const ingredientes = searchParams.get("ingredientes")?.split(",").map(i => i.trim()) || [];

  try {
    const recetas = await prisma.receta.findMany({
        where: {
          titulo: { contains: nombre, mode: "insensitive" },
          ...(ingredientes.length > 0 && {
            RecetaIngrediente: {
              some: {
                Ingrediente: {
                  nombre: { in: ingredientes },
                },
              },
            },
          }),
        },
        include: {
          RecetaIngrediente: {
            include: { Ingrediente: true },
          },
        },
      });      

    return NextResponse.json(recetas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error buscando recetas" }, { status: 500 });
  }
}
