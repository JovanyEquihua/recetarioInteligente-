import crypto from "crypto";
import { db } from "@/libs/db";

/**
 * Genera un token seguro con expiración.
 */
export const generateToken = async (email, type) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // 1 hora de validez

  if (type === "verification") {
    return await db.verificationToken.create({
      data: { email, token, expires },
    });
  } else if (type === "password_reset") {
    return await db.passwordResetToken.create({
      data: { email, token, expires },
    });
  }
};

/**
 * Verifica si un token es válido y lo elimina después de su uso.
 */
export const verifyToken = async (token, type) => {
  let tokenData;
  if (type === "verification") {
    tokenData = await db.verificationToken.findUnique({ where: { token } });
  } else if (type === "password_reset") {
    tokenData = await db.passwordResetToken.findUnique({ where: { token } });
  }

  if (!tokenData || tokenData.expires < new Date()) {
    throw new Error("Token inválido o expirado.");
  }

  // Elimina el token después de su uso
  if (type === "verification") {
    await db.verificationToken.delete({ where: { token } });
  } else if (type === "password_reset") {
    await db.passwordResetToken.delete({ where: { token } });
  }

  return tokenData.email;
};
