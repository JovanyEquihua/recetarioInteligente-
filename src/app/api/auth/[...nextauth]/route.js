// Se define la API de autenticación con NextAuth.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../../../../libs/db";
import bcrypt from "bcryptjs";
import { limiter } from "../../../../middleware/rateLimit";
import { getMaxAge } from "next/dist/server/image-optimizer";
import logger from "../../../../utils/logger";
import requestIp from "request-ip";


// Configuración de opciones de autenticación para NextAuth.js
export const authOptions = {
  // Proveedores de autenticación
  providers: [
    // Login con Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    
    // Proveedor de autenticación con credenciales
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        contraseña: { label: "Contraseña", type: "password" },
      },
      // Función de autorización para validar las credenciales del usuario
      async authorize(credentials, req) {
       
  

        // Verificar que se hayan ingresado email y contraseña
        if (!credentials.email || !credentials.contraseña) {
          throw new Error("Datos inválidas");
        }

        // Limitar intentos de login a 5 por cada 15 minutos
        if (!(await limiter(req))) {
          throw new Error("Demasiados intentos de inicio de sesión. Intenta más tarde.");
        }

         // Obtener información de la solicitud
         const ip = requestIp.getClientIp(req) || "Desconocida";// Obtener IP del usuario
         const timestamp = new Date().toISOString(); // Obtener timestamp actual

        // Buscar usuario en la base de datos
        const user = await db.usuario.findUnique({
          where: { email: credentials.email },
        });
        if (!user) { // Si el usuario no existe, lanzar un error
          logger.info({ email, ip, timestamp, status: "error", reason: "Usuario erroneo" });
          throw new Error("Credenciales inválidas");
        }

     
        // Comparar contraseñas
        const passwordMatch = await bcrypt.compare(credentials.contraseña, user.contrase_a); 
       // Si las contraseñas no coinciden, lanzar un error
        if (!passwordMatch) {
          logger.info({ email: credentials.email, ip, timestamp, status: "error", reason: "Contraseña erronea" });
          throw new Error("Credenciales inválidas ");
        }

        // Verificar si el usuario fue verificado 
        if (!user.verificado) {
          logger.info({ email: credentials.email, ip, timestamp, status: "error", reason: "Usuario no verificado" });
          throw new Error("El usuario no está verificado");
        }

        // Registrar el inicio de sesión exitoso en el archivo de log
        logger.info({ email: credentials.email, ip, timestamp, status: "success", reason: "Ingresar" });

        // Retornar los datos del usuario si la autenticación es exitosa
        return { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol };
      },
    }),
  ],
  
  // Callbacks para personalizar el comportamiento de NextAuth.js
  callbacks: {
    // Callback para personalizar la sesión
    async session({ session, token }) {
      // Agregar el id y rol del usuario al objeto de sesión
      session.user.id = token.id;
      session.user.rol = token.rol;
      return session;
    },
    // Callback para personalizar el token JWT
    async jwt({ token, user }) {
      // Si el usuario está presente, agregar el id y rol al token
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
      }
      return token;
    },
  },
  // Secreto para firmar los tokens JWT
  secret: process.env.NEXTAUTH_SECRET,
  // Configuración de la estrategia de sesión
  session: {
    strategy: "jwt",
    maxAge : 30 * 60, // 30 minutos
  },
  // Páginas personalizadas para NextAuth.js
  pages: {
    signIn: "/login", // Página de inicio de sesión
  },
};


// Definir el manejador de NextAuth.js con las opciones de autenticación
const handler = NextAuth(authOptions);

// Exportar el manejador para las rutas GET y POST
export { handler as GET, handler as POST };