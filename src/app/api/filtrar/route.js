//API para filtrar datos de la base de datos " receta "

import { db } from "../../../libs/db";

export async function POST(req) {
    try {
      const { tipoComida  } = await req.json();
  
      // mostrar datos de la bd
      const resultados = await db.receta.findMany({
        where: {
            tipoComida: {
              nombre: tipoComida,
            },
          },
          include: {
            tipoComida: true,
          },
        });
  
  
      return new Response(JSON.stringify(resultados), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Error en el filtrado:", error);
      return new Response(JSON.stringify({ error: "Error en el filtrado" }), {
        status: 500
      });
    }
  }
  