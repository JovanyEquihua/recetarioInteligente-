import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../libs/db";
import bcrypt from "bcryptjs";
import { limiter } from "../middleware/rateLimit";
import { logAction } from "../utils/logger";
import requestIp from "request-ip";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        contraseña: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.contraseña) {
          throw new Error("Datos inválidos");
        }
        if (!(await limiter(req))) {
          throw new Error("Demasiados intentos. Intenta más tarde.");
        }

        let ip = requestIp.getClientIp(req) || "Desconocida";
        if (ip === "::1") ip = "localhost";
        const timestamp = new Date().toISOString();

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

        if (!user) {
          logAction("login", {
            email: credentials.email,
            ip,
            status: "error",
            reason: "Usuario errado",
          });
          throw new Error("Credenciales inválidas");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.contraseña,
          user.contrase_a
        );
        if (!passwordMatch) {
          logAction("login", {
            usuario: `${user.nombre} ${(user.apellidoP || "").trim()} ${(user.apellidoM || "").trim()}`,
            ip,
            status: "error",
            reason: "Contraseña errada",
          });
          throw new Error("Credenciales inválidas");
        }

        logAction("login", {
          usuario: `${user.nombre} ${(user.apellidoP || "").trim()} ${(user.apellidoM || "").trim()}`,
          ip,
          status: "success",
          reason: "Ingresó correctamente",
        });

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
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.rol = token.rol;
      session.user.nombre = token.nombre;
      session.user.email = token.email;
      session.user.fotoPerfil = token.fotoPerfil;
      session.user.primerInicioSesion = token.primerInicioSesion;

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
        token.nombre = user.nombre;
        token.fotoPerfil = user.fotoPerfil;
        token.primerInicioSesion = user.primerInicioSesion;
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    // maxAge: 30 * 60,
  },
  pages: {
    signIn: "/login",
  },
};