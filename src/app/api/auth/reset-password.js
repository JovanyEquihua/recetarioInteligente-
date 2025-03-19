// Importar nodemailer para enviar correos electrónicos
import nodemailer from "nodemailer";

// Definir el manejador de la API para resetear la contraseña
export default async function handler(req, res) {
  // Verificar si el método de la solicitud es POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  // Obtener el email del cuerpo de la solicitud
  const { email } = req.body;

  // Verificar si el email está presente en el cuerpo de la solicitud
  if (!email) {
    return res.status(400).json({ error: "Se requiere un correo electrónico" });
  }

  try {
    // Configurar transporte de nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Tu correo en .env
        pass: process.env.EMAIL_PASS, // Contraseña de aplicación en .env
      },
    });

    // Crear enlace de recuperación (esto normalmente sería un token en la BD)
    const resetLink = `http://localhost:3003/restablecer-contraseña?email=${encodeURIComponent(email)}`;

    // Configurar el correo
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Remitente del correo electrónico
      to: email, // Destinatario del correo electrónico
      subject: "Recuperación de contraseña", // Asunto del correo electrónico
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`, // Texto plano del correo electrónico
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetLink}">${resetLink}</a>`, // Contenido HTML del correo electrónico
    });

    // Retornar una respuesta exitosa
    return res.status(200).json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    // Manejar errores al enviar el correo
    console.error("Error al enviar el correo:", error);
    return res.status(500).json({ error: "Error al enviar el correo" });
  }
}