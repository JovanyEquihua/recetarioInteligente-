import { db } from "../../../../libs/db";
import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        // Extraer el correo electrónico del cuerpo de la solicitud
        const { email } = await req.json();

        // Verificar que el correo electrónico esté presente
        if (!email) {
            return new Response(JSON.stringify({ error: "Se requiere un correo electrónico" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Configurar el transportador de nodemailer para enviar correos
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS2,
            },
        });

        await db.passwordResetToken.deleteMany({
            where: { email }
        });

        // Generar un código de restablecimiento de 6 dígitos
        const resetCode = Math.floor(100000 + Math.random() * 900000); // Código de 6 dígitos
       
        // Guardar el token en la base de datos
        const savedToken = await db.passwordResetToken.create({
            data: {
                email,
                token: resetCode.toString(),
                expires: new Date(Date.now() + 10 * 60 * 1000), // El token expira en 10 minutos
            },
        });
        //console.log("Token guardado en la base de datos para:", savedToken);

        // Enviar el código de recuperación por correo electrónico
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Código de recuperación",
            html: `<p>Tu código de recuperación es: <strong>${resetCode}</strong></p>`,
        });

        // Responder con un mensaje de éxito
        return new Response(JSON.stringify({ message: "Código enviado al correo" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        //console.error("Error al enviar el correo:", error);
        return new Response(JSON.stringify({ error: "Error al enviar el correo" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
