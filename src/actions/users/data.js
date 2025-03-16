//Esta carpeta contiene los datos de los usuarios que se van a mostrar en la aplicación
//Aquí se pueden agregar, modificar o eliminar usuarios

import { db } from "@/libs/db";


/**
 * Obtiene un usuario por su email. LOGIN
 */
export const getUserByEmail = async (email) => {
  return await db.usuario.findUnique({
    where: { email },
  });
};

/**
 * Crea un nuevo usuario con contraseña hasheada. REGISTRO
 * 
 */

