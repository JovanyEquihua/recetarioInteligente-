import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  // Buscar el token en la BD
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { email } });

  if (!resetToken || resetToken.token !== token || new Date() > resetToken.expires) {
    return res.status(400).json({ error: "Código inválido o expirado" });
  }

  // Hashear la nueva contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Actualizar la contraseña del usuario
  await prisma.usuario.update({
    where: { email },
    data: { contraseña: hashedPassword },
  });

  // Eliminar el token usado
  await prisma.passwordResetToken.delete({ where: { email } });

  return res.status(200).json({ message: "Contraseña actualizada exitosamente" });
}
