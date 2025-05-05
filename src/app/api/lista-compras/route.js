import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener lista
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const usuarioId = parseInt(searchParams.get("usuarioId"));

  if (!usuarioId) {
    return NextResponse.json({ error: "Usuario no especificado" }, { status: 400 });
  }

  const lista = await prisma.listaCompra.findMany({
    where: { usuarioId },
    orderBy: { id: 'desc' }
  });

  return NextResponse.json(lista);
}

// Agregar item
export async function POST(req) {
  const body = await req.json();
  const { usuarioId, nombreIngrediente, cantidad } = body;

  if (!usuarioId || !nombreIngrediente || !cantidad) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const nuevoItem = await prisma.listaCompra.create({
    data: {
      usuarioId,
      nombreIngrediente,
      cantidad
    }
  });

  return NextResponse.json(nuevoItem);
}

// Eliminar item
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "ID no especificado" }, { status: 400 });
  }

  await prisma.listaCompra.delete({
    where: { id }
  });

  return NextResponse.json({ mensaje: "Eliminado correctamente" });
}
