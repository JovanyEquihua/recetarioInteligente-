//API para filtrar recetas

import { db } from "../../../libs/db";

/* Este endpoint se encarga de filtrar 
  recetas según los criterios proporcionados
  en el cuerpo de la solicitud */


export async function POST(req) {
  try {
    // Obtener los filtros del cuerpo de la solicitud
    const filtrarRecetas = await req.json();
    console.log("Filtros recibidos:", filtrarRecetas);
   //Verificar los filtros
    const filtros = {};

      // Si se envía el filtro de tipo de comida, lo agrega al objeto de filtros
    if (filtrarRecetas.tipoComida) {
      filtros.tipoComida = {
        nombre: filtrarRecetas.tipoComida,
      };
    }
  // Si se envía el filtro de dificultad, lo agrega al objeto de filtros
    if (filtrarRecetas.dificultad) {
      filtros.dificultad = filtrarRecetas.dificultad;
      
    }
    console.log("Filtros aplicados:", filtros);
// Si se envía el filtro de tiempo de preparación, lo agrega al objeto de filtros
    if (filtrarRecetas.tiempoPreparacion) {
      filtros.tiempoPreparacion = 
        parseInt(filtrarRecetas.tiempoPreparacion);
      
    }
// Si se envía el filtro de calificaciones, lo agrega al objeto de filtros
    if (filtrarRecetas.calificaciones) {
      filtros.calificaciones = {
        puntuacion: filtrarRecetas.calificaciones,
      };
    }
// Si se envía el filtro de tipo de sabor, lo agrega al objeto de filtros
    if (filtrarRecetas.tipoSabor) {
      filtros.tipoSabor = {
        nombreSabor: filtrarRecetas.tipoSabor,
      };
    }
 // Si se envía el filtro de porciones, lo agrega al objeto de filtros
    if (filtrarRecetas.porciones) {
      filtros.porciones = parseInt(filtrarRecetas.porciones);
    }

  //Realiza la consulta a la base de datos con los filtros construidos

    const resultados = await db.receta.findMany({
      where: filtros, // Aplica los filtros
      include: {
        tipoComida: true, // Incluye información relacionada con el tipo de comida
        calificaciones: true, // Incluye información relacionada con las calificaciones
        tipoSabor: true, // Incluye información relacionada con el tipo de sabor
      },
    });
    console.log("Resultados encontrados:", recetas);

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
