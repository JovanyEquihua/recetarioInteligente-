//API para comentar receta
import { db } from "@/libs/db"; // Importa la base de datos
import { logAction } from "@/utils/logger";

// Manejador para solicitudes POST
export async function POST(req) {
    // Extrae los datos enviados en el cuerpo de la solicitud
    const { recetaId, comentario, usuario } = await req.json();
    
    try {
        // Busca la receta en la base de datos por su ID
        const receta = await db.receta.findUnique({
            where: { id: recetaId }, // Busca una receta con el ID proporcionado
        });
    
        // Si la receta no existe, devuelve un error 404
        if (!receta) {
            return new Response(JSON.stringify({ error: "Receta no encontrada" }), {
                status: 404, // Código de estado HTTP 404 (No encontrado)
            });
        }

        // Crea un nuevo comentario en la base de datos
        const nuevoComentario = await db.comentario.create({
            data: {
                comentario, // Contenido del comentario
                usuario,    // Usuario que realiza el comentario
                recetaId,   // ID de la receta asociada
            },
        });
        logAction("comentarios", {
            usuario,                            // Usuario que comentó
            recetaId,                           // Receta comentada
            comentario,                         // Contenido del comentario
            timestamp: new Date().toISOString() // Hora exacta del comentario
        });        
        
        // Devuelve el comentario recién creado con un código de estado 201 (Creado)
        return new Response(JSON.stringify(nuevoComentario), { status: 201 });
    } catch (error) {
        // Si ocurre un error, devuelve un mensaje de error con un código de estado 500
        return new Response(JSON.stringify({ error: "Error al comentar" }), {
            status: 500, // Código de estado HTTP 500 (Error interno del servidor)
        });
    }
}