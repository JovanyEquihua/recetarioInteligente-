
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../libs/db";
import bcrypt from "bcryptjs";
import { limiter } from "../middleware/rateLimit";
import logger from "../utils/logger";
import requestIp from "request-ip";


// Configuración de opciones de autenticación para NextAuth
export const authOptions = {
    // Lista de proveedores de autenticación
  providers: [
    // Proveedor de autenticación con Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Proveedor de autenticación con credenciales personalizadas (email y contraseña)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        contraseña: { label: "Contraseña", type: "password" },
      },
    // Función que autoriza al usuario con email y contraseña
      async authorize(credentials, req) {
    
        if (!credentials.email || !credentials.contraseña) {
       
          throw new Error("Datos inválidas");
        }
    // Limita los intentos de inicio de sesión para evitar ataques de fuerza bruta
        if (!(await limiter(req))) {
          throw new Error("Demasiados intentos. Intenta más tarde.");
        }

     // Obtiene la IP del usuario y la hora del intento
        const ip = requestIp.getClientIp(req) || "Desconocida";
        const timestamp = new Date().toISOString();
     // Busca el usuario en la base de datos por email
        const user = await db.usuario.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            nombre: true,
            email: true,
            rol: true,
            fotoPerfil: true, 
            primerInicioSesion: true,
            contrase_a: true,
          },
        });
    // Si el usuario no existe, registra el intento y lanza error
        if (!user) {
          logger.info({
            email: credentials.email,
            ip,
            timestamp,
            status: "error",
            reason: "Usuario errado",
          });
          throw new Error("Credenciales inválidas");
        }
       // Si el usuario no existe, registra el intento y lanza error
        const passwordMatch = await bcrypt.compare(
          credentials.contraseña,
          user.contrase_a
        );
       // Si la contraseña no coincide, registra el intento y lanza error
        if (!passwordMatch) {
          logger.info({
            email: credentials.email,
            ip,
            timestamp,
            status: "error",
            reason: "Contraseña errada",
          });
          throw new Error("Credenciales inválidas");
        }
       // Si todo es correcto, registra el acceso exitoso
        logger.info({
          email: credentials.email,
          ip,
          timestamp,
          status: "success",
          reason: "Ingresó correctamente",
        });
       // Devuelve los datos del usuario para la sesión
        return {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
          primerInicioSesion: user.primerInicioSesion,
          fotoPerfil: user.fotoPerfil,
        };

      },
    }),
  ],
 // Callbacks para personalizar la sesión y el token JWT
  callbacks: {
   // Personaliza la sesión agregando datos del usuario al objeto session
    async session({ session, token,  }) {
      session.user.id = token.id;
      session.user.rol = token.rol;
      session.user.nombre = token.nombre;
      session.user.email = token.email;
      session.user.fotoPerfil = token.fotoPerfil;
      session.user.nombreUsuario = token.nombreUsuario;
      session.user.apellidoP = token.apellidoP;
      session.user.apellidoM = token.apellidoM;
      session.user.primerInicioSesion = token.primerInicioSesion;
   

      return session;
    },
        // Personaliza el token JWT agregando datos del usuario
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
        token.nombre = user.nombre;
        token.fotoPerfil = user.fotoPerfil;
        token.primerInicioSesion = user.primerInicioSesion;
      } else if (!token.id) {
         // Si el usuario viene de Google y se recarga la página, busca los datos en la base de datos
        const dbUser = await db.usuario.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.rol = dbUser.rol;
          token.nombre = dbUser.nombre;
          token.primerInicioSesion = dbUser.primerInicioSesion;
          token.fotoPerfil = dbUser.fotoPerfil;
        }
      }
       // Retorna el token modificado
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  //Token JWT maneja sesiones de larga duración, se mantiene miestrar el usuario navega 
  //en lugar de sesiones de base de datos
  //Esto significa que el token se almacena en el cliente
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },
  pages: {
    signIn: "/login",
  },
};
