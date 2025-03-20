// Limitar intentos de login a 5 por cada 15 minutos

// Función para crear un limitador de tasa


const rateLimit = () => {
    // Mapa para almacenar los intentos de login por IP
    const tokenMap = new Map();
  
    // Retorna una función middleware que verifica la tasa de solicitudes
    return (req) => {
      // Obtener la IP del cliente desde los encabezados o la solicitud
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "127.0.0.1";

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
  
      // Si el número de intentos es mayor o igual a 5, bloquear la solicitud
      if (data.count >= 5) {
        return false;
      }
  
      // Incrementar el contador de intentos y actualizar el tiempo de la última solicitud
      tokenMap.set(ip, { count: data.count + 1, lastRequest: Date.now() });
      return true;
    };
  };
  
  // Exportar el limitador de tasa
  export const limiter = rateLimit();