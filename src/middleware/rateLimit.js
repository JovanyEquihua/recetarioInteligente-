import nodemailer from "nodemailer";

// Limitar intentos de login a 5 por cada 15 minutos

// Función para crear un limitador de tasa
const rateLimit = () => {
  // Mapa para almacenar los intentos de login por IP
  const tokenMap = new Map();

  // Configuración del transportador de nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Retorna una función middleware que verifica la tasa de solicitudes
  return async (req) => {
    // Obtener la IP del cliente desde los encabezados o la solicitud
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "127.0.0.1";

    // Obtener el correo electrónico del cuerpo de la solicitud
    const { email } = req.body;

    // Si la IP no está en el mapa, agregarla con un intento inicial
    if (!tokenMap.has(ip)) {
      tokenMap.set(ip, { count: 1, lastRequest: Date.now() });
      return true;
    }

    // Obtener los datos de la IP del mapa
    const data = tokenMap.get(ip);
    // Calcular el tiempo transcurrido desde la última solicitud
    const timeElapsed = Date.now() - data.lastRequest;

    // Si han pasado más de 15 minutos, reiniciar el contador de intentos
    if (timeElapsed > 15 * 60 * 1000) {
      tokenMap.set(ip, { count: 1, lastRequest: Date.now() });
      return true;
    }

    // Si el número de intentos es mayor o igual a 5, bloquear la solicitud y enviar un correo
    if (data.count >= 5) {
      // Enviar un correo de alerta al usuario
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Alerta de intentos de inicio de sesión",
        html: `<p>Se han detectado más de 5 intentos fallidos de inicio de sesión en tu cuenta. Si no fuiste tú, por favor, cambia tu contraseña inmediatamente.</p>`,
      });
      return false;
    }

    // Incrementar el contador de intentos y actualizar el tiempo de la última solicitud
    tokenMap.set(ip, { count: data.count + 1, lastRequest: Date.now() });
    return true;
  };
};

// Exportar el limitador de tasa
export const limiter = rateLimit();