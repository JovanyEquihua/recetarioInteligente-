// Se define la API de autenticación con NextAuth.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../../../../libs/db";
import bcrypt from "bcryptjs";
import { limiter } from "../../../../middleware/rateLimit";
import { getMaxAge } from "next/dist/server/image-optimizer";

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
        console.log("credentials", credentials.email, credentials.contraseña);
        
        // Verificar que se hayan ingresado email y contraseña
        if (!credentials.email || !credentials.contraseña) {
          throw new Error("Email y contraseña son obligatorios");
        }

        // Limitar intentos de login a 5 por cada 15 minutos
        if (!limiter(req)) {
          throw new Error("Demasiados intentos de inicio de sesión. Intenta más tarde.");
        }

        // Buscar usuario en la base de datos
        const user = await db.usuario.findUnique({
          where: { email: credentials.email },
        });

        // Si el usuario no existe, lanzar un error
        if (!user) {
          throw new Error("Credenciales inválidas usuario");
        }

        // Comparar contraseñas
        const passwordMatch = await bcrypt.compare(credentials.contraseña, user.contrase_a);
        // Si las contraseñas no coinciden, lanzar un error
        if (!passwordMatch) {
          throw new Error("Credenciales inválidas contraseña");
        }

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
    maxAge : 1 * 60, // 30 minutos
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