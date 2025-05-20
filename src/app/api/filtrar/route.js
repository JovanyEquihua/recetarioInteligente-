import { db } from "@/libs/db";


export async function POST(req) {
  try {
    // Obtener los filtros del cuerpo de la solicitud
    const filtrarRecetas = await req.json();
    console.log("Filtros recibidos:", filtrarRecetas);

    // Construir el objeto de filtros
    const filtros = {};

    // Filtro por tipo de comida
    if (filtrarRecetas.tipoComida?.length > 0) {
      filtros.tipoComida = {
        nombre: { in: filtrarRecetas.tipoComida },
      };
    }

    // Filtro por dificultad
    if (filtrarRecetas.dificultad) {
      filtros.dificultad = filtrarRecetas.dificultad;
    }

    // Filtro por rango de tiempo de preparación
    if (filtrarRecetas.tiempoPreparacionMin || filtrarRecetas.tiempoPreparacionMax) {
      filtros.tiempoPreparacion = {
        gte: filtrarRecetas.tiempoPreparacionMin || 0,
        lte: filtrarRecetas.tiempoPreparacionMax || 999,
      };
    }

    // Filtro por calificaciones
    if (filtrarRecetas.calificaciones) {
      filtros.calificaciones = {
        puntuacion: filtrarRecetas.calificaciones,
      };
    }

    // Filtro por tipo de sabor
    if (filtrarRecetas.tipoSabor?.length > 0) {
      filtros.tipoSabor = {
        nombreSabor: { in: filtrarRecetas.tipoSabor },
      };
    }

    // Filtro por porciones
    if (filtrarRecetas.porciones) {
      filtros.porciones = parseInt(filtrarRecetas.porciones, 10);
    }

    // Realizar la consulta a la base de datos con los filtros construidos
    const resultados = await db.receta.findMany({
      where: filtros, // Aplica los filtros
      include: {
        tipoComida: true, // Incluye información relacionada con el tipo de comida
        calificaciones: true, // Incluye información relacionada con las calificaciones
        tipoSabor: true, // Incluye información relacionada con el tipo de sabor
      },
    });

    console.log("Resultados encontrados:", resultados);

    return new Response(JSON.stringify(resultados), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en el filtrado:", error);
    return new Response(JSON.stringify({ error: "Error en el filtrado" }), {
      status: 500,
    });
  }
}