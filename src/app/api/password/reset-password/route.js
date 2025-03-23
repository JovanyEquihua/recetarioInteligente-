import { db } from "@/libs/db"; // Importar la instancia de la base de datos
import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return new Response(JSON.stringify({ error: "Se requiere un correo electrónico" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetCode = Math.floor(100000 + Math.random() * 900000); // Código de 6 dígitos
       
  // Guardar el token en la base de datos
      const savedToken = await db.passwordResetToken.create({
        data: {
            email,
            token: resetCode.toString(),
            expires: new Date(Date.now() + 10 * 60 * 1000),
        },

      });
console.log("Token guardado en la base de datos para:", savedToken);
// Envía el código en el correo
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Código de recuperación",
  html: `<p>Tu código de recuperación es: <strong>${resetCode}</strong></p>`,
});

        return new Response(JSON.stringify({ message: "Código enviado al correo" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

       
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        return new Response(JSON.stringify({ error: "Error al enviar el correo" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}


