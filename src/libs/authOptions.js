import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { db } from "../libs/db"
import bcrypt from "bcryptjs"
import { limiter } from "../middleware/rateLimit"
import { logAction } from "../utils/logger"
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
        let ip = requestIp.getClientIp(req) || "Desconocida"
        if (ip === "::1") ip = "localhost"
        const timestamp = new Date().toISOString()
        const user = await db.usuario.findUnique({
          where: { email: credentials.email },
        })
        // Verifica si el usuario existe
        if (!user) {
            // Si no existe, registra el intento fallido en el log con el email y la IP
          logAction("login", { email: credentials.email, ip, status: "error", reason: "Usuario errado" });
          throw new Error("Credenciales inválidas")
        }
        // Compara la contraseña ingresada con la contraseña hasheada del usuario en la base de datos
        const passwordMatch = await bcrypt.compare(credentials.contraseña, user.contrase_a)
        if (!passwordMatch) {
            // Si la contraseña no coincide, registra el intento fallido con el nombre del usuario e IP
          logAction("login", { usuario: `${user.nombre} ${user.apellidoP || ""} ${user.apellidoM || ""}`.trim(), ip, status: "error", reason: "Contraseña errada" });
          throw new Error("Credenciales inválidas")
        }
        // Si todo está correcto, registra el inicio de sesión exitoso en los logs
        logAction("login", { usuario: `${user.nombre} ${user.apellidoP || ""} ${user.apellidoM || ""}`.trim(), ip, status: "success", reason: "Ingresó correctamente" });
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
