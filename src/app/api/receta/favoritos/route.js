import { NextResponse } from 'next/server';
import { db } from "../../../../libs/db";




export async function POST(req) {
  try {
    const { recetaId, usuarioId } = await req.json();

    const yaExiste = await db.favorito.findFirst({
      where: {
        recetaId: parseInt(recetaId),
        usuarioId: parseInt(usuarioId),
      },
    });

    if (yaExiste) {
      return NextResponse.json({ mensaje: 'Ya es favorito' }, { status: 200 });
    }

    const nuevoFavorito = await db.favorito.create({
      data: {
        recetaId: parseInt(recetaId),
        usuarioId: parseInt(usuarioId),
      },
    });

    return NextResponse.json(nuevoFavorito, { status: 201 });
  } catch (error) {
    console.error('Error al agregar favorito:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { recetaId, usuarioId } = await req.json();

    await db.favorito.deleteMany({
      where: {
        recetaId: parseInt(recetaId),
        usuarioId: parseInt(usuarioId),
      },
    });

    return NextResponse.json({ mensaje: 'Favorito eliminado' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}


export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const recetaId = searchParams.get('recetaId');
      const usuarioId = searchParams.get('usuarioId');
  
      const favorito = await prisma.favorito.findFirst({
        where: {
          recetaId: parseInt(recetaId),
          usuarioId: parseInt(usuarioId),
        },
      });
  
      return NextResponse.json({ esFavorito: !!favorito }, { status: 200 });
    } catch (error) {
      console.error('Error al verificar favorito:', error);
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
  }
  