import nodemailer from "nodemailer";

export async function sendResetEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const url = `http://localhost:3000/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Recuperación de contraseña",
    html: `<p>Haz clic <a href="${url}">aquí</a> para restablecer tu contraseña.</p>`,
  });
}
