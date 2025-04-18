import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { db } from "../libs/db"
import bcrypt from "bcryptjs"
import { limiter } from "../middleware/rateLimit"
import logger from "../utils/logger"
import requestIp from "request-ip"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        contraseña: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.contraseña) {
          throw new Error("Datos inválidas")
        }
        if (!(await limiter(req))) {
          throw new Error("Demasiados intentos. Intenta más tarde.")
        }
        const ip = requestIp.getClientIp(req) || "Desconocida"
        const timestamp = new Date().toISOString()
        const user = await db.usuario.findUnique({
          where: { email: credentials.email },
        })
        if (!user) {
          logger.info({ email: credentials.email, ip, timestamp, status: "error", reason: "Usuario errado" })
          throw new Error("Credenciales inválidas")
        }
        const passwordMatch = await bcrypt.compare(credentials.contraseña, user.contrase_a)
        if (!passwordMatch) {
          logger.info({ email: credentials.email, ip, timestamp, status: "error", reason: "Contraseña errada" })
          throw new Error("Credenciales inválidas")
        }
        logger.info({ email: credentials.email, ip, timestamp, status: "success", reason: "Ingresó correctamente" })
        return { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol, primerInicioSesion: user.primerInicioSesion }
      },
    }),
  ],
  callbacks: {
    async session({ session, token,user }) {
      session.user.id = token.id
      session.user.rol = token.rol
      session.user.nombre = token.nombre
      session.user.email = token.email
      session.user.fotoPerfil = token.fotoPerfil
      session.user.nombreUsuario = token.nombreUsuario
      session.user.apellidoP = token.apellidoP
      session.user.apellidoM = token.apellidoM
      session.user.primerInicioSesion = token.primerInicioSesion
      //session.user.id = user.id;

      return session
    },
    async jwt({ token, user,}) {
      if (user) {
        token.id = user.id
        token.rol = user.rol
        token.nombre = user.nombre
        token.primerInicioSesion = user.primerInicioSesion
      
      }
  
      return token
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },
  pages: {
    signIn: "/login",
  },
}
