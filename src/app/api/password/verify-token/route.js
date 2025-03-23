
import { db } from "@/libs/db"; // Importar la instancia de la base de datos
import bcrypt from "bcrypt"; // Importar bcrypt para hashear contraseñas

export async function POST(req) {
    try {
        
        // Obtener los datos del cuerpo de la solicitud
        const { email, token, newPassword } = await req.json();

        
        // Verificar que todos los datos estén presentes
        if (!email || !token || !newPassword) {
            return new Response(JSON.stringify({ error: "Datos incompletos" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Buscar el token en la base de datos
        const resetToken = await db.passwordResetToken.findFirst({
            where: { email, token }
        });




        // Verificar que el token sea válido y no haya expirado
        if (!resetToken ) {
            return new Response(JSON.stringify({ error: "Código inválido o expirado" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña del usuario
        await db.usuario.update({
            where: { email },
            data: { contrase_a: hashedPassword },
        });

        // Eliminar el token usado
        await db.passwordResetToken.delete({ where: { id: resetToken.id } });

        // Retornar una respuesta exitosa
        return new Response(JSON.stringify({ message: "Contraseña actualizada exitosamente" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        // Manejar errores y retornar una respuesta de error
        console.error("Error al actualizar la contraseña:", error);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}