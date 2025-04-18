//API para calificar receta
import { db } from "../../../../libs/db";

// Manejador para solicitudes POST

export async function POST(req) {
    // Extrae los datos enviados en el cuerpo de la solicitud
    const { recetaId, calificacion, usuario } = await req.json();
    
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
    
        // Crea una nueva calificación en la base de datos
        const nuevaCalificacion = await db.calificacion.create({
            data: {
                calificacion, // Contenido de la calificación
                usuario,       // Usuario que realiza la calificación
                recetaId,      // ID de la receta asociada
            },
        });
    
        // Devuelve la calificación recién creada con un código de estado 201 (Creado)
        return new Response(JSON.stringify(nuevaCalificacion), { status: 201 });
    } catch (error) {
        // Si ocurre un error, devuelve un mensaje de error con un código de estado 500
        return new Response(JSON.stringify({ error: "Error al calificar" }), {
            status: 500, // Código de estado HTTP 500 (Error interno del servidor)
        });
    }
}