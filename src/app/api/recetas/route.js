import { db } from "@/libs/db"

export async function POST(req) {
    try {
      const body = await req.json();
      console.log("Datos recibidos en la API:", body);
  
      const {
        usuarioId,
        titulo,
        descripcion,
        tiempoPreparacion,
        dificultad,
        porciones,
        ingredientes,
        preparacion,
        imagen,
        idTipoComida,
        idTipoSabor,
      } = body;
  
      if (
        !usuarioId || !titulo || !descripcion || !tiempoPreparacion || !dificultad ||
        !porciones || !preparacion || !imagen || !idTipoComida || !idTipoSabor
      ) {
        return new Response(JSON.stringify({ error: "Faltan campos requeridos" }), { status: 400 });
      }
  
      const receta = await db.receta.create({
        data: {
          usuarioId,
          titulo,
          descripcion,
          tiempoPreparacion,
          dificultad,
          porciones,
          imagen,
          idTipoComida,
          idTipoSabor,
          ingredientes: {
            create: ingredientes.map((ing) => ({
              cantidad: ing.cantidad,
              ingrediente: {
                connectOrCreate: {
                  where: { nombre: ing.nombre },
                  create: { nombre: ing.nombre,
                    Tipo:  "Verduras", // Asigna un tipo por defecto si no se proporciona 
                  },
                },
              },
            })),
          },
        },
      });
  
      return new Response(JSON.stringify(receta), { status: 201 });
    } catch (error) {
      console.error("Error al crear receta:", error);
      return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
    }
  }
  

