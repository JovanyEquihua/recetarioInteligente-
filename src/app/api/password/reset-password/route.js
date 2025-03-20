
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Se requiere un correo electrónico" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetCode = Math.floor(100000 + Math.random() * 900000); // Código de 6 dígitos

    // Envía el código en el correo
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Código de recuperación",
      html: `<p>Tu código de recuperación es: <strong>${resetCode}</strong></p>`,
    });

    return res.status(200).json({ message: "Código enviado al correo" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return res.status(500).json({ error: "Error al enviar el correo" });
  }
}

