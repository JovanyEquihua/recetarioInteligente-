// Este middleware protege las rutas /dashboard y /admin, redirigiendo a /login 
// si el usuario no está autenticado o no tiene permisos de admin

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Permitir acceso sin autenticación a las rutas públicas
  const publicRoutes = ["/", "/login", "/register"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Si el usuario no tiene token, redirigirlo a login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si la ruta es de admin y el usuario no es admin, redirigirlo
  if (pathname.startsWith("/admin") && token.rol !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Configurar en qué rutas se aplica el middleware
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"], // Rutas protegidas
};
