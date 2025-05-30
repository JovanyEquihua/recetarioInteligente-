import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Correo", type: "text" },
        contraseña: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const { email, contraseña } = credentials;

        const user = await prisma.usuario.findUnique({
          where: { email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(contraseña, user.contrase_a);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.nombre || user.email,
          email: user.email,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const existingUser = await prisma.usuario.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Guardar en la sesión que debe ir a completar el registro
          user.needsCompletion = true;
        }
      }
      return true;
    },

    async session({ session, token, user }) {
      if (token.sub) {
        const dbUser = await prisma.usuario.findUnique({
          where: { email: session.user.email },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.completed = true;
        } else {
          session.user.completed = false;
        }
      }

      return session;
    },

    async jwt({ token, user, account, profile }) {
      if (user?.needsCompletion) {
        token.needsCompletion = true;
      }
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },
});
export { handler as GET, handler as POST };
