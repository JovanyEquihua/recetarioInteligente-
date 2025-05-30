import { db } from "@/libs/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const topCalificaciones = await db.calificacion.groupBy({
      by: ['recetaId'],
      _avg: { puntuacion: true },
    });

    if (!topCalificaciones || topCalificaciones.length === 0) {
      return NextResponse.json([]);
    }

    const ordenadas = topCalificaciones
      .sort((a, b) => (b._avg.puntuacion ?? 0) - (a._avg.puntuacion ?? 0))
      .slice(0, 6);

    const recetaIds = ordenadas.map((item) => item.recetaId);
   
    let recetas = [];
    if (recetaIds.length > 0) {
      recetas = await db.receta.findMany({
        where: { id: { in: recetaIds } },
        select: {
          id: true,
          titulo: true,
          imagen: true,
           usuario: {
            select: {
              nombreUsuario: true,
            },
          },
        },
      });
    }


    const recetasConPromedio = recetas.map((receta) => {
      const promedioObj = ordenadas.find((item) => item.recetaId === receta.id);
      return {
        ...receta,
        promedio: promedioObj?._avg?.puntuacion || 0,
     usuario: receta.usuario
      ? {
         
          nombreUsuario: receta.usuario.nombreUsuario,
        }
      : {
         
          nombreUsuario: "anonimo",
        },
  };
});

    return NextResponse.json(recetasConPromedio);
  } catch (error) {
  
    return NextResponse.json({ error: "Error al obtener recetas top" }, { status: 500 });
  }
}

